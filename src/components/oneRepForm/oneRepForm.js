import { React, useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";

const OneRepForm = () => {
  const [oneRepMax, setOneRepMax] = useState("");
  const [mappedLifts, setMappedLifts] = useState("");

  useEffect(() => {
    const mapLifts = async () => {
      const maxes = await getOneRepMax(Auth);
      return maxes
        ? setMappedLifts(mapLiftsAgain(maxes.fiveThreeOne))
        : setMappedLifts("NO WORKOUT DATA");
    };
    const oneReps = async () => {
      const oneRepMaxes = await getOneRepMax(Auth);
      return oneRepMaxes
        ? setOneRepMax(oneRepMaxes.oneRepMax)
        : setOneRepMax({
            Squat: 100,
            Deadlift: 100,
            "Bench Press": 100,
            "Overhead Press": 100,
            "Current Week": 1,
          });
    };
    oneReps();
    mapLifts();
  }, []);

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
    setMappedLifts(mapLiftsAgain(updatedOneRepMax.updated.fiveThreeOne));

    return updatedOneRepMax;
  };
  //get api call to get weight progression
  const getOneRepMax = async (auth) => {
    const user = await Auth.currentAuthenticatedUser();
    try {
      const oneRepMax = await API.get(
        "strengthworkouts",
        "/api/strengthworkouts/",
        {
          queryStringParameters: {
            id: `${user.attributes.sub}`,
            name: `${auth.user.username}`,
          },
        }
      );
      return oneRepMax;
    } catch (error) {
      console.log(error);
    }
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

  const mapLiftsAgain = (mappedLifts) => {
    const lifts = {};
    for (let [key1, val1] of Object.entries(mappedLifts)) {
      //iterate over outer object - key is week, value is lift object containing key: lift and value: increment
      for (const [key2, val2] of Object.entries(val1)) {
        //iterate over inner object - key2 is name of lift, value2 is object containing array of increments, reps, and done
        lifts[`${key1}`] = lifts[`${key1}`] || [];
        lifts[`${key1}`].push(
          <>
            <h3>{key2}</h3>
            {val2.increments.map((item, index) => {
              return (
                <div
                  key={`${index} ${item}`}
                  style={{ display: "inline-flex" }}
                >
                  <li>
                    {item.toString(10).slice(0, 6)}, REPS: {val2.reps[index]}
                  </li>
                  <input
                    type="checkbox"
                    defaultChecked={val2.done[index]}
                  ></input>
                </div>
              );
            })}
          </>
        );
      }
    }
    let finalLifts = [];
    for (const [key1, val1] of Object.entries(lifts)) {
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
                    key={`${item} ${index}`}
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

  return (
    <>
      <button onClick={() => getOneRepMax(Auth)}>Get One Rep Max</button>
      <form onSubmit={handleSubmit}>
        {createInputsList(oneRepMax)}
        <input type="submit" value="Send" />
      </form>
      {mappedLifts}
    </>
  );
};

export default OneRepForm;
