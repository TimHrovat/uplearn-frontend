import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ClassesApi } from "../../api/classes/classes-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export type TimetableClassSelectionProps = {
  active: boolean;
  onSelection?: (className: string) => any;
};

const animatedComponents = makeAnimated();
let options: { value: string; label: string }[] = [];

export default function TimetableClassSelection({
  active,
  onSelection,
}: TimetableClassSelectionProps) {
  const [error, setError] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");

  const { status: classesStatus, data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: ClassesApi.getAll,
  });

  useEffect(() => {
    if (onSelection)
      onSelection(
        selectedClassName === "" ? classes?.data[0].name : selectedClassName
      );
  });

  if (classesStatus === "loading") return <Loader active={true} />;
  if (classesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  options = [];
  classes?.data.forEach((c: { name: string }) => {
    options.push({
      value: c.name,
      label: `${c.name}`,
    });
  });

  const handleSelectionChange = (selected: any) => {
    setSelectedClassName(selected.value);
  };

  if (!active) return <></>;

  return (
    <>
      <div className="form-control w-1/4 min-w-[20rem] mb-5 z-20">
        <label className="label">
          <span className="label-text">Classes:</span>
        </label>
        <Select
          options={options}
          closeMenuOnSelect={true}
          components={animatedComponents}
          onChange={handleSelectionChange}
          defaultValue={{
            value: classes?.data[0].name,
            label: `${classes?.data[0].name}`,
          }}
          styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
        />
      </div>
    </>
  );
}
