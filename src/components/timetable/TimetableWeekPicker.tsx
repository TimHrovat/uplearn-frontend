import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export interface TimetableWeekPickerProps {
  onSelection: (startDate: Date, endDate: Date) => any;
}

export default function TimetableWeekPicker({
  onSelection,
}: TimetableWeekPickerProps) {
  const [startDate, setStartDate] = useState(initStartDate());
  const [endDate, setEndDate] = useState(initEndDate(startDate));

  useEffect(() => {
    onSelection(startDate, endDate);
  });

  const oneWeekBack = () => {
    setStartDate(moment(startDate).subtract(7, "d").toDate());
    setEndDate(moment(endDate).subtract(7, "d").toDate());
  };

  const oneWeekForward = () => {
    setStartDate(moment(startDate).add(7, "d").toDate());
    setEndDate(moment(endDate).add(7, "d").toDate());
  };

  return (
    <>
      <div>
        <div className="flex flex-row items-center">
          <button className="btn mr-6" onClick={oneWeekBack}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div>
            <DateRangeFormatted startDate={startDate} endDate={endDate} />
          </div>
          <button className="btn ml-6" onClick={oneWeekForward}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </>
  );
}

export const initStartDate = () => {
  let date = new Date();
//   date.setHours(0, 0, 0, 0);

  while (date.getDay() !== 1) {
    date = moment(date).subtract(1, "d").toDate();
  }

  return date;
};

export const initEndDate = (startDate: Date) => {
  return moment(startDate).add(4, "d").toDate();
};

function DateRangeFormatted({ startDate, endDate }: DateRangeFormattedProps) {
  return (
    <>
      <span>
        {startDate.getDate() +
          "." +
          (startDate.getMonth() + 1) +
          "." +
          startDate.getFullYear()}
      </span>
      {" - "}
      <span>
        {endDate.getDate() +
          "." +
          (endDate.getMonth() + 1) +
          "." +
          endDate.getFullYear()}
      </span>
    </>
  );
}

interface DateRangeFormattedProps {
  startDate: Date;
  endDate: Date;
}
