import { React, useEffect, useState } from "react";
import { Auth, API } from "aws-amplify";
import { Link } from "react-router-dom";

const MyWorkout = ({ userData, setUserData, saveData }) => {
  const [loading, setLoading] = useState(true);
  const [secondaryLifts, setSecondaryLifts] = useState({
    "Bench Press": [
      { name: "Dumbbell Chest Press", sets: 5, reps: 15 },
      { name: "Dumbbell Row", sets: 5, reps: 10 },
    ],
    Squat: [
      { name: "Leg press", sets: 5, reps: 15 },
      { name: "Leg Curl", sets: 5, reps: 10 },
    ],
    Deadlift: [
      { name: "Good Morning", sets: 5, reps: 12 },
      { name: "Hanging Leg Raise", sets: 5, reps: 15 },
    ],
    "Overhead Press": [
      { name: "Dip", sets: 5, reps: 15 },
      { name: "Chin Up", sets: 5, reps: 10 },
    ],
  });

  //Sort returned storage object by its keys
  //https://stackoverflow.com/questions/17684921/sort-json-object-in-javascript

  function isObject(v) {
    return "[object Object]" === Object.prototype.toString.call(v);
  }

  JSON.sort = function (o) {
    //check if o is an object and its keys contain part of word "week"
    if (isObject(o)) {
      return (
        Object.keys(o)
          //sort week number string by number
          .sort(function (a, b) {
            if (a.match(/(\d+)/g) && b.match(/(\d+)/g)) {
              return (
                Number(b.match(/(\d+)/g)[0]) - Number(a.match(/(\d+)/g)[0])
              );
            } else return "";
          })
          .reduce(function (a, k) {
            a[k] = JSON.sort(o[k]);

            return a;
          }, {})
      );
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
            <h3
              //Headings of each week of workout
              //Nested ternaries check if all checkboxes are true
              //If yes color is green
              //If not checks if current week is true
              //If yes color is blue, otherwise its gray
              className={`text-lg font-extrabold uppercase text-center w-1/2 m-auto transition-colors  ${
                userData.fiveThreeOne[key1][key2].done.every((v) => v === true)
                  ? "text-green-600  "
                  : //Check if current week is equal to week in question
                  key1.replace(/^\D+/g, "") ==
                    userData.oneRepMax["Current Week"]
                  ? "text-blue-500 text-xl "
                  : "text-gray-500 "
              } 
                
              `}
            >
              {key2}
            </h3>
            <div className="grid grid-cols-3 text-center px-3 w-full justify-between font-bold text-gray-500 text-xl">
              <span className="text-left">Weight</span> <span>REPS:</span>
              <span className="text-right">Done</span>
            </div>
            {val2.increments.map((item, index) => {
              return (
                <div
                  key={`${index} ${item}`}
                  className="grid grid-cols-3 px-3 w-full  justify-between text-gray-400 font-semibold text-xl  "
                >
                  <span className="text-left">
                    {item.toString(10).slice(0, 5) + " kg"}
                  </span>
                  <span className="text-center">{val2.reps[index]}</span>
                  <input
                    className={`transition-colors justify-self-end ${
                      userData.fiveThreeOne[key1][key2].done.every(
                        (v) => v === true
                      )
                        ? "text-green-600  "
                        : "text-blue-500"
                    } `}
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

            <div className="text-center w-full text-xl font-bold text-gray-500 pt-4">
              <span>Secondary lifts:</span>
              {console.log(Object.values(secondaryLifts[key2]))}
              {Object.values(secondaryLifts[key2]).map((item) => {
                return (
                  <div className="grid grid-cols-3 min-w-full px-3">
                    <span className="pb-1 text-left">{`${item.name} `}</span>
                    <span>SETS: {item.sets}</span>
                    <span className="text-right">REPS: {item.reps}</span>
                  </div>
                );
              })}
            </div>
          </>
        );
      }
    }
    let finalLifts = [];
    for (const [key1, val1] of Object.entries(lifts)) {
      finalLifts.push(
        <div
          className={`card max-w-md bg-gray-900 rounded  shadow-sm transition-colors ${
            //Check if current week is equal to week in question, if yes set it at the top of the card list
            key1.replace(/^\D+/g, "") == userData.oneRepMax["Current Week"]
              ? "order-1 max-w-xl "
              : "order-3 "
          } `}
          //Onclick sets current week equal to week in question
          onClick={(event) => {
            const key = key1.replace(/^\D+/g, ""); // replace all leading non-digits with nothing
            const newData = { ...userData };
            //Check if current week is equal to week in question, if no then scroll to top
            if (
              key1.replace(/^\D+/g, "") != userData.oneRepMax["Current Week"]
            ) {
              window.scrollTo(0, 0);
            }
            //Set current week equal to the week card clicked on
            newData.oneRepMax["Current Week"] = parseInt(key, 10);
            setUserData(newData);
          }}
        >
          <div
            className={`card-header py-3 text-2xl font-extrabold text-center  uppercase rounded-t flex justify-center items-center cursor-pointer ${
              //Check if current week is equal to week in question if yes set background color to blue
              key1.replace(/^\D+/g, "") == userData.oneRepMax["Current Week"]
                ? "bg-blue-600 text-3xl"
                : "bg-gray-600"
            }`}
          >
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
    //Add spacer so the current week is at the top
    finalLifts.splice(2, 0, <div className="w-full order-2"></div>);

    return (
      <>
        <div className="cardsContainer w-full flex flex-wrap gap-10 justify-center pt-10">
          <button className="btn-primary px-6" onClick={saveData}>
            Save workout
          </button>
        </div>
        <>{finalLifts}</>
      </>
    );
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
        <div className="cardsContainer w-full flex flex-wrap gap-10 justify-center p-10">
          {mapLifts(userData)}
        </div>
      </>
    );
  }
};

export default MyWorkout;
