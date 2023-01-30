import { StylesConfig } from "react-select";

const cssRoot = document.querySelector(":root");
const cssInputBordered = document.querySelector(".input-bordered");

const b1 = cssRoot === null ? null : getComputedStyle(cssRoot).getPropertyValue("--b1");
const b2 = cssRoot === null ? null : getComputedStyle(cssRoot).getPropertyValue("--ns");

const twBgOpacity = cssInputBordered === null ? null : getComputedStyle(cssInputBordered).getPropertyValue("--tw-bg-opacity");
const twBorderOpacity = cssInputBordered === null ? null : getComputedStyle(cssInputBordered).getPropertyValue("--tw-border-opacity");

console.log(twBgOpacity);

export const style: StylesConfig = {
  control: (styles) => ({
    ...styles,
    backgroundColor: `hsl(${b1})`?? "",
    borderColor: `hsl(${b2})`?? "",
  }),
};
