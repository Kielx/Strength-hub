import { React, useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";

const OneRepForm = () => {
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
            name={lift}
            value={oneRepMax[lift]}
          ></input>
        </label>
      );
    }
    return inputList;
  };

  return (
    <form onSubmit={handleSubmit}>
      {createInputsList(oneRepMax)}
      <input type="submit" value="Send" />
    </form>
  );
};

export default OneRepForm;
