import { React, useState } from "react";
import OneRepMaxInput from "./components/oneRepMaxInput/OneRepMaxInput";

import {
  calculateIncrementsForWeek,
  calculateBase,
} from "./helpers/calculateIncrements";

export default function App() {
  const [oneRepMax, setOneRepMax] = useState({
    squat: 0,
    deadlift: 0,
    benchPress: 0,
    overheadPress: 0,
  });

  const handleChange = (event) => {
    setOneRepMax((prevState) => ({
      ...prevState,
      [event.target.name]: [event.target.value],
    }));
  };
  return (
    <>
      <h1>Strength-Hub</h1>
      <div>
        <OneRepMaxInput handleChange={handleChange} name="squat" />
        <p data-testid="weightOutput">
          {calculateIncrementsForWeek(1, calculateBase(oneRepMax.squat))}
        </p>
      </div>
      <div>
        <OneRepMaxInput handleChange={handleChange} name="deadlift" />
        <p data-testid="weightOutput">
          {calculateIncrementsForWeek(1, calculateBase(oneRepMax.deadlift))}
        </p>
      </div>
      <div>
        <OneRepMaxInput handleChange={handleChange} name="benchPress" />
        <p data-testid="weightOutput">
          {calculateIncrementsForWeek(1, calculateBase(oneRepMax.benchPress))}
        </p>
      </div>
      <div>
        <OneRepMaxInput handleChange={handleChange} name="overheadPress" />
        <p data-testid="weightOutput">
          {calculateIncrementsForWeek(
            1,
            calculateBase(oneRepMax.overheadPress)
          )}
        </p>
      </div>
    </>
  );
}
