import {
  calculateIncrementsForWeek,
  calculateBase,
} from "./helpers/calculateIncrements";
import React, { useState } from "react";

export default function App() {
  const [oneRepMax, setOneRepMax] = useState(0);

  function handleChange(event) {
    setOneRepMax(event.target.value);
  }

  return (
    <>
      <h1>Strength-Hub</h1>
      <input
        type="number"
        name="oneRepMax"
        data-testid="weightInput"
        onChange={handleChange}
      ></input>
      <p data-testid="weightOutput">
        {calculateIncrementsForWeek(1, calculateBase(oneRepMax))}
      </p>
    </>
  );
}
