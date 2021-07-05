import { React, useState } from "react";
import MapLift from "./components/mappedLifts/MapLift";
import OneRepMaxInput from "./components/oneRepMaxInput/OneRepMaxInput";

export default function App() {
  const [oneRepMax, setOneRepMax] = useState({
    Squat: 0,
    Deadlift: 0,
    "Bench Press": 0,
    "Overhead Press": 0,
  });

  const handleChange = (event) => {
    setOneRepMax((prevState) => ({
      ...prevState,
      [event.target.name]: [event.target.value],
    }));
  };

  const createInputsList = (oneRepMax) => {
    const inputList = [];
    for (const lift in oneRepMax) {
      inputList.push(
        <OneRepMaxInput key={lift} handleChange={handleChange} name={lift} />
      );
    }
    return inputList;
  };

  const createWeightProgressionList = (oneRepMaxObj, numberOfWeeks) => {
    const weightProgressionList = [];
    for (const lift in oneRepMaxObj) {
      weightProgressionList.push(
        <div key={lift}>
          <h2>{lift}</h2>
          <MapLift
            lift={lift}
            oneRepMax={oneRepMaxObj[lift]}
            numberOfWeeks={numberOfWeeks}
          />
        </div>
      );
    }
    return weightProgressionList;
  };

  return (
    <>
      <h1>Strength-Hub</h1>
      {createInputsList(oneRepMax)}
      {createWeightProgressionList(oneRepMax, 6)}
    </>
  );
}
