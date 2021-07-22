import { React, useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";

const OneRepForm = () => {
  const [oneRepMax, setOneRepMax] = useState("");
  const [mappedLifts, setMappedLifts] = useState("");
  const [preMapped, setPreMapped] = useState("");
  const [loading, setLoading] = useState(true);

  //Sort returned storage object by its keys
  //https://stackoverflow.com/questions/17684921/sort-json-object-in-javascript
  function isObject(v) {
    return "[object Object]" === Object.prototype.toString.call(v);
  }

  JSON.sort = function (o) {
    if (Array.isArray(o)) {
      return o.sort().map(JSON.sort);
    } else if (isObject(o)) {
      return Object.keys(o)
        .sort()
        .reduce(function (a, k) {
          a[k] = JSON.sort(o[k]);

          return a;
        }, {});
    }

    return o;
  };

  useEffect(() => {
    const mapLifts = async () => {
      setLoading(true);
      let maxes;
      sessionStorage.getItem("preMapped")
        ? setPreMapped(
            JSON.sort(JSON.parse(sessionStorage.getItem("preMapped")))
          )
        : (maxes = await getOneRepMax(Auth));
      setLoading(false);
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
        <label key={lift} className="flex flex-wrap w-full">
          <span className="w-full text-center font-bold text-gray-400 text-2xl pt-3">
            {lift}
          </span>
          <input
            onChange={handleChange}
            type="number"
            name={lift}
            value={oneRepMax[lift]}
            className="w-1/6 m-auto text-center font-extrabold text-xl bg-gray-900 text-blue-500 shadow-sm"
          ></input>
        </label>
      );
    }
    return inputList;
  };

  const mapLiftsAgain = (mappedLifts) => {
    const lifts = {};
    mappedLifts = JSON.sort(mappedLifts);
    for (let [key1, val1] of Object.entries(mappedLifts)) {
      //iterate over outer object - key is week, value is lift object containing key: lift and value: increment
      for (const [key2, val2] of Object.entries(val1)) {
        //iterate over inner object - key2 is name of lift, value2 is object containing array of increments, reps, and done
        lifts[`${key1}`] = lifts[`${key1}`] || [];
        lifts[`${key1}`].push(
          <>
            <h3 className="text-lg font-extrabold uppercase text-center w-full text-blue-500">
              {key2}
            </h3>
            <div className="flex px-3 w-full flex-wrap justify-between font-bold text-gray-500 text-xl">
              <span className="w-24">Weight</span> <span>REPS:</span>
              <span>Done</span>
            </div>
            {val2.increments.map((item, index) => {
              return (
                <div
                  key={`${index} ${item}`}
                  className="flex px-3 w-full flex-wrap justify-between text-gray-400 font-semibold text-xl"
                >
                  <span className="sm:w-20">
                    {item.toString(10).slice(0, 5) + " kg"}
                  </span>
                  <span className="">{val2.reps[index]}</span>
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
        <div className="card max-w-md bg-gray-900 rounded  shadow-sm">
          <div className="card-header py-3 text-2xl font-extrabold text-center bg-blue-600 uppercase rounded-t">
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

  if (loading)
    return (
      <div className="flex w-full h-screen items-center ">
        <span className="text-3xl text-gray-300 font-extrabold m-auto">
          Loading...
        </span>
      </div>
    );

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-wrap">
        {createInputsList(oneRepMax)}

        <input type="submit" id="submitInput" className="hidden" />
        <label
          htmlFor="submitInput"
          className="m-auto mt-6 shadow-md font-medium py-3 px-6 text-blue-100
           cursor-pointer bg-blue-600 hover:bg-blue-500 rounded text-lg text-center w-48 transition-colors active:relative active: top-px"
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
