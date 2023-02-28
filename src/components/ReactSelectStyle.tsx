import { StylesConfig } from "react-select";

export const style: StylesConfig = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: `#2b303b`,
    borderColor: isFocused ? "#3bbef8" : "#454a57",
    boxShadow: "none",
    ":hover": {
      borderColor: isFocused ? "#3bbef8" : "#454a57",
    },
    cursor: "pointer",
  }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    color: isSelected ? "#2b303b" : "#cccccc",
    backgroundColor: isSelected
      ? "#3bbef8"
      : isFocused
      ? "RGBA(59, 190, 248, 0.1)"
      : "#2b303b",
    cursor: "pointer",
    ":active": {
      ...styles[":active"],
      backgroundColor: "RGBA(59, 190, 248, 0.4)",
      color: "#cccccc",
    },
  }),
  singleValue: (styles) => ({ ...styles, color: "#cccccc" }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#2b303b",
  }),
  input: (styles) => ({
    ...styles,
    color: "#cccccc",
    cursor: "text",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#1a1d23",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#cccccc",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#cccccc",
    backgroundColor: "#1e2027",
    ":hover": {
      ...styles[":hover"],
      backgroundColor: "RGBA(231, 49, 35, 0.3)",
    },
  }),
};
