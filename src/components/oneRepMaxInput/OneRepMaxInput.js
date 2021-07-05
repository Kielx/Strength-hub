import { React } from "react";

export default function OneRepMaxInput({ handleChange, name, oneRepMax }) {
  return (
    <>
      <label htmlFor={name}>{name}</label>
      <input
        type="number"
        name={name}
        data-testid="weightInput"
        onChange={handleChange}
        value={oneRepMax}
      ></input>
    </>
  );
}
