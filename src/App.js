import { React, useState, useEffect } from "react";
import MapLift from "./components/mappedLifts/MapLift";
import OneRepMaxInput from "./components/oneRepMaxInput/OneRepMaxInput";

export default function App() {
  const [oneRepMax, setOneRepMax] = useState(
    JSON.parse(localStorage.getItem("oneRepMax")) || {
      Squat: 0,
      Deadlift: 0,
      "Bench Press": 0,
      "Overhead Press": 0,
    }
  );

  const [currentWeek, setCurrentWeek] = useState(6);

  useEffect(() => {
    localStorage.setItem("oneRepMax", JSON.stringify(oneRepMax));
  }, [oneRepMax]);

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
        <OneRepMaxInput
          key={lift}
          handleChange={handleChange}
          name={lift}
          oneRepMax={oneRepMax[lift]}
        />
      );
    }
    return inputList;
  };

  const createWeightProgressionList = (oneRepMaxObj, numberOfWeeks) => {
    const weightProgressionList = [];
    for (const lift in oneRepMaxObj) {
      weightProgressionList.push(
        <div
          key={lift}
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>{lift}</h2>
          <MapLift
            lift={lift}
            oneRepMax={oneRepMaxObj[lift]}
            numberOfWeeks={numberOfWeeks}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
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
      <div
        style={{
          display: "flex",
        }}
      >
        {createWeightProgressionList(oneRepMax, 6)}
      </div>
    </>
  );
}
