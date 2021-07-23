import { React, useEffect, useState } from "react";
import { Auth, API } from "aws-amplify";
import { Link } from "react-router-dom";

const MyWorkout = ({ userData, setUserData }) => {
  const [loading, setLoading] = useState(true);

  //Sort returned storage object by its keys
  //https://stackoverflow.com/questions/17684921/sort-json-object-in-javascript

  function isObject(v) {
    return "[object Object]" === Object.prototype.toString.call(v);
  }

  JSON.sort = function (o) {
    if (isObject(o)) {
      return Object.keys(o)
        .sort()
        .reduce(function (a, k) {
          a[k] = JSON.sort(o[k]);

          return a;
        }, {});
    }

    return o;
  };

  //get api call to get weight progression
  const getUserData = async (auth) => {
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

  //UseEffect for fetching data. If data is already fetched, it will not be fetched again
  //If data is not fetched, it will be fetched and then stored in userData
  //If data is already fetched, it will be stored in userData
  //Stored data from sessionstorage is sorted by its keys
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      //Fetch data from api
      //If data is already fetched, it will not be fetched again, being taken from sessionstorage
      if (
        //Checks if sessionstorage has userData AND if userData is not empty (because API returns empty object if no data is found)
        sessionStorage.getItem("userData") &&
        Object.keys(JSON.parse(sessionStorage.getItem("userData"))).length
      ) {
        setUserData(JSON.sort(JSON.parse(sessionStorage.getItem("userData"))));
        setLoading(false);
      }
      //Otherwise it will be fetched and then stored in userData
      else {
        let data = await getUserData(Auth);
        if (data) {
          setUserData(JSON.sort(data));
          setLoading(false);
        }
        //In case of null or empty object being returned from DB
        //It means that user has not created any workout yet
        //Therefore we set default values for all fields
        else {
          setUserData({
            oneRepMax: {
              Squat: 100,
              Deadlift: 100,
              "Bench Press": 100,
              "Overhead Press": 100,
              "Current Week": 1,
            },
          });
        }
        setLoading(false);
      }
    }
    fetchData();
  }, [setUserData]);

  //On each userData change the data is stored in sessionStorage
  useEffect(() => {
    sessionStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const mapLifts = (userData) => {
    const lifts = {};
    if (!userData.hasOwnProperty("fiveThreeOne")) {
      return (
        <div className="text-center text-3xl text-gray-400 font-extrabold w-full flex flex-col justify-center items-center p-20 gap-10">
          <span>You have no workouts!</span>

          <Link
            to="/create-workout"
            className="shadow-md font-medium py-3 px-6 text-white cursor-pointer bg-blue-600 hover:bg-blue-500 rounded text-lg text-center w-48 transition-colors active:relative"
          >
            Click here to create some
          </Link>
        </div>
      );
    }
    for (let [key1, val1] of Object.entries(userData.fiveThreeOne)) {
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
                    onClick={(event) => {
                      const newData = { ...userData };
                      newData.fiveThreeOne[key1][key2].done[index] =
                        !newData.fiveThreeOne[key1][key2].done[index];
                      setUserData(newData);
                    }}
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

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center ">
        {/* <span className="text-3xl text-gray-300 font-extrabold m-auto">
          Loading...
        </span> */}
        <div className="lds-roller m-auto">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="cardsContainer w-full flex flex-wrap gap-10 justify-center p-10 pt-20">
          {mapLifts(userData)}
        </div>
      </>
    );
  }
};

export default MyWorkout;
