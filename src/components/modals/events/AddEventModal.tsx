import React, { useRef, useState } from "react";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import Modal from "../Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Loader from "../../Loader";
import { ClassesApi } from "../../../api/classes/classes-api";
import { useQuery } from "@tanstack/react-query";
import { style } from "../../ReactSelectStyle";
import { EmployeesApi } from "../../../api/employees/employees-api";
import { EmployeeInterface } from "../SubjectEditModal";
import DatePicker from "react-datepicker";
import {
  CreateEventInterface,
  EventsApi,
} from "../../../api/events/events-api";
import moment from "moment";

export type AddEventModalProps = {
  active: boolean;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();
let classOptions: { value: string; label: string }[] = [];
let employeeOptions: { value: string; label: string }[] = [];
let typeOptions: { value: string; label: string }[] = [
  { value: "ACT", label: "Activity" },
  { value: "HOLLIDAY", label: "Holliday" },
];

export default function AddEventModal({
  active,
  onActiveChange,
}: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const today = new Date();
  const [date, setDate] = useState<Date>(
    today.getDay() === 0 || today.getDay() === 6
      ? moment().isoWeekday(1).add(1, "weeks").toDate()
      : today
  );
  const [selectedType, setSelectedType] = useState("");
  const startTime = useRef<HTMLInputElement>(null);
  const endTime = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);

  const { status: classesStatus, data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: ClassesApi.getAll,
  });

  const { status: employeesStatus, data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: EmployeesApi.getAll,
  });

  if (classesStatus === "loading" || employeesStatus === "loading")
    return <Loader active={true} />;
  if (classesStatus === "error" || employeesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  classOptions = [];
  classes?.data.forEach((c: { name: string }) => {
    classOptions.push({
      value: c.name,
      label: `${c.name}`,
    });
  });

  employeeOptions = [];
  employees?.data.forEach((emp: EmployeeInterface) => {
    employeeOptions.push({
      value: emp.id,
      label: `${emp.user.name} ${emp.user.surname}`,
    });
  });

  const handleSelectedClass = (selected: any) => {
    const valueArr: string[] = [];

    selected.forEach((sel: any) => {
      valueArr.push(sel.value);
    });

    setSelectedClasses(valueArr);
  };

  const handleSelectedEmployee = (selected: any) => {
    const valueArr: string[] = [];

    selected.forEach((sel: any) => {
      valueArr.push(sel.value);
    });

    setSelectedEmployees(valueArr);
  };

  const handleDateChange = (date: Date) => {
    if (date !== null) setDate(date);
  };

  const handleTypeChange = (selected: any) => {
    setSelectedType(selected.value);
  };

  const createEvent = async () => {
    setError("");
    setSuccess("");

    if (!date) {
      setError("You need to provide a date");
      return;
    }

    if (selectedType === "") {
      setError("You need to provide a type");
      return;
    }

    if (selectedType === "ACT" && startTime.current?.value === "") {
      setError("Please provide a start time for the activity");
      return;
    }

    if (selectedType === "ACT" && endTime.current?.value === "") {
      setError("Please provide a end time for the activity");
      return;
    }

    if (
      selectedType === "ACT" &&
      startTime.current?.value + ":00" >= endTime.current?.value + ":00"
    ) {
      setError("The event must end later than it is started");
      return;
    }

    if (selectedClasses.length === 0) {
      setError("At least one class must participate in the event");
      return;
    }

    if (selectedEmployees.length === 0) {
      setError("At least one employee must participate in the event");
      return;
    }

    const data: CreateEventInterface = {
      classes: selectedClasses,
      employees: selectedEmployees,
      date: date.toISOString(),
      type: selectedType,
      startTime: startTime.current?.value,
      endTime: endTime.current?.value,
      description:
        description.current === null ? "" : description.current.value,
    };

    setLoading(true);

    await EventsApi.create(data)
      .then((res) => {
        if (res) {
          setSelectedClasses([]);
          setSelectedEmployees([]);
          setSelectedType("");
          onActiveChange(false);
        }
      })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .finally(() => setLoading(false));
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <Modal
        active={active}
        title={"Add event"}
        onActiveChange={(isActive) => {
          onActiveChange?.(isActive);
          setSelectedClasses([]);
          setSelectedEmployees([]);
          setSelectedType("");
        }}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Date:</span>
          </label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="dd. MM. yyyy"
            minDate={new Date()}
            filterDate={isWeekday}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Type:</span>
          </label>
          <Select
            options={typeOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleTypeChange}
            styles={style}
          />
        </div>
        {selectedType === "ACT" ? (
          <>
            <div className="form-control w-full mb-5">
              <label className="label">
                <span className="label-text">Start time:</span>
              </label>
              <input
                type="time"
                className="input input-bordered w-full"
                ref={startTime}
              />
            </div>
            <div className="form-control w-full mb-5">
              <label className="label">
                <span className="label-text">End time:</span>
              </label>
              <input
                type="time"
                className="input input-bordered w-full"
                ref={endTime}
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Classes:</span>
          </label>
          <Select
            options={classOptions}
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={handleSelectedClass}
            styles={style}
            isMulti
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Employees:</span>
          </label>
          <Select
            options={employeeOptions}
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={handleSelectedEmployee}
            styles={style}
            isMulti
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            ref={description}
          ></textarea>
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createEvent}
        >
          Create Event
        </button>
      </Modal>
    </>
  );
}
