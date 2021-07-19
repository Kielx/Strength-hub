import { React, useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";

const OneRepForm = () => {
  const [oneRepMax, setOneRepMax] = useState("");
  const [mappedLifts, setMappedLifts] = useState("");
  const [preMapped, setPreMapped] = useState("");

  useEffect(() => {
    const mapLifts = async () => {
      let maxes;
      sessionStorage.getItem("preMapped")
        ? setPreMapped(JSON.parse(sessionStorage.getItem("preMapped")))
        : (maxes = await getOneRepMax(Auth));
      return maxes ? setPreMapped(maxes.fiveThreeOne) : setMappedLifts("");
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
    sessionStorage.getItem("oneRepMax")
      ? setOneRepMax(JSON.parse(sessionStorage.getItem("oneRepMax")))
      : oneReps();

    mapLifts();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("oneRepMax", JSON.stringify(oneRepMax));
  }, [oneRepMax]);

  useEffect(() => {
    sessionStorage.setItem("preMapped", JSON.stringify(preMapped));
  }, [preMapped]);

  useEffect(() => {
    setMappedLifts(mapLiftsAgain(preMapped));
  }, [preMapped]);

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
    setPreMapped(updatedOneRepMax.updated.fiveThreeOne);
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
            <h3 className="text-lg font-bold uppercase text-center w-full">
              {key2}
            </h3>
            <div className="flex px-3 w-full flex-wrap justify-between font-semibold">
              <span>Weight [kg]</span> <span>REPS:</span>
              <span>Done</span>
            </div>
            {val2.increments.map((item, index) => {
              return (
                <div
                  key={`${index} ${item}`}
                  className="flex px-3 w-full flex-wrap justify-between"
                >
                  <span className="w-16">
                    {item.toString(10).slice(0, 5) + " kg"}
                  </span>
                  <span>{val2.reps[index]}</span>
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
        <div className="card max-w-md bg-yellow-100 border-2 border-yellow-500 rounded-lg shadow-md">
          <div className="card-header py-3 text-lg font-extrabold text-center bg-yellow-400 uppercase">
            <h3>{key1}</h3>
          </div>
          <div className="card-block">
            <ul className="list-group">
              {val1.map((item, index) => {
                return (
                  <div
                    key={`${item} ${index}`}
                    className="exerciseGroup flex flex-wrap py-4"
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
      <form onSubmit={handleSubmit}>
        {createInputsList(oneRepMax)}

        <input type="submit" id="submitInput" className="hidden" />
        <label
          htmlFor="submitInput"
          className="mx-4 shadow-md font-medium py-3 px-6 text-yellow-100
           cursor-pointer bg-yellow-500 hover:bg-yellow-400 rounded text-lg text-center w-48 transition-colors active:relative active: top-px"
        >
          Submit
        </label>
      </form>
      <div className="cardsContainer w-screen flex flex-wrap gap-10 justify-center p-10">
        {mappedLifts}
      </div>
    </>
  );
};

export default OneRepForm;
