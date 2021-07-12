import { React, useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { calculateIncrementsForWeek } from "../../helpers/calculateIncrements";

const OneRepForm = () => {
  const [oneRepMax, setOneRepMax] = useState(
    JSON.parse(localStorage.getItem("oneRepMax")) || {
      Squat: 100,
      Deadlift: 100,
      "Bench Press": 100,
      "Overhead Press": 100,
      "Current Week": 1,
    }
  );

  useEffect(() => {
    localStorage.setItem("oneRepMax", JSON.stringify(oneRepMax));
  }, [oneRepMax]);

  const handleChange = (event) => {
    setOneRepMax((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await Auth.currentAuthenticatedUser();
    const updatedOneRepMax = await API.post(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        body: {
          id: `${user.attributes.sub}`,
          name: `${Auth.user.username}`,
          oneRepMax: oneRepMax,
        },
      }
    );
    console.log(updatedOneRepMax);
    return updatedOneRepMax;
  };

  const createInputsList = (oneRepMax) => {
    const inputList = [];
    for (const lift in oneRepMax) {
      inputList.push(
        <label key={lift}>
          {lift}
          <input
            onChange={handleChange}
            type="number"
            name={lift}
            value={oneRepMax[lift]}
          ></input>
        </label>
      );
    }
    return inputList;
  };

  function mapLifts(oneRepMax, currentWeek) {
    const lifts = {};
    currentWeek = parseInt(currentWeek, 10);
    let begin = currentWeek <= 3 ? 1 : currentWeek - 2;
    for (let i = 1; i <= begin + 2; i++) {
      for (const [key, value] of Object.entries(oneRepMax)) {
        //Check if objects and properties are defined, if not set to empty
        //https://stackoverflow.com/questions/17643965/how-to-automatically-add-properties-to-an-object-that-is-undefined
        if (key !== "Current Week") {
          lifts[`week ${i}`] = lifts[`week ${i}`] || {};
          lifts[`week ${i}`][key] = lifts[`week ${i}`][key] || [];
          lifts[`week ${i}`][key] = lifts[`week ${i}`][key] =
            calculateIncrementsForWeek(i, value);
        }
      }
    }
    console.log(lifts);
    return lifts;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {createInputsList(oneRepMax)}
        <input type="submit" value="Send" />
      </form>
    </>
  );
};

export default OneRepForm;
