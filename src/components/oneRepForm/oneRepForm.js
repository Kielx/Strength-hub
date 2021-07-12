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
    for (let i = 1; i <= begin + 4; i++) {
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

  const mappedLifts = mapLifts(oneRepMax, oneRepMax["Current Week"]);
  const mapLiftsAgain = (mappedLifts) => {
    const lifts = {};
    for (const [key1, val1] of Object.entries(mappedLifts)) {
      //iterate over outer object - key is week, value is lift object containing key: lift and value: increment
      console.log(`${key1} : ${val1}`);
      for (const [key2, val2] of Object.entries(val1)) {
        //iterate over inner object - key is name of lift, value is array of increments
        console.log(`${key2} : ${val2}`);
        lifts[`${key1}`] = lifts[`${key1}`] || [];
        lifts[`${key1}`].push(
          <>
            <h3>{key2}</h3>
            {val2.map((item) => {
              return (
                <div style={{ display: "inline-flex" }}>
                  <li key={item}>{item}</li> <input type="checkbox"></input>
                </div>
              );
            })}
          </>
        );
      }
    }
    let finalLifts = [];
    for (const [key1, val1] of Object.entries(lifts)) {
      //iterate over outer object - key is week, value is lift object containing key: lift and value: increment
      console.log(`${key1} : ${val1}`);
      finalLifts.push(
        <div className="card">
          <div className="card-header">
            <h3>{key1}</h3>
          </div>
          <div className="card-block">
            <ul className="list-group">
              {val1.map((item, index) => {
                return (
                  <div
                    key={`${key1} ${index}`}
                    className="exerciseGroup"
                    style={{
                      display: "inline-flex",
                      flexDirection: "column",
                      width: "20%",
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return finalLifts;
  };
  mapLiftsAgain(mappedLifts);
  return (
    <>
      <form onSubmit={handleSubmit}>
        {createInputsList(oneRepMax)}
        <input type="submit" value="Send" />
      </form>
      {mapLiftsAgain(mappedLifts)}
    </>
  );
};

export default OneRepForm;
