import { React, useEffect, useState } from "react";
import { Auth, API } from "aws-amplify";

const CreateWorkout = ({ userData, setUserData }) => {
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

  //On each change previous user data is assigned to new user data
  //oneRepMax is assigned via spread operator the rest of data and lift is passed the value of target
  const handleChange = (event) => {
    const newData = {
      ...userData,
      oneRepMax: {
        ...userData.oneRepMax,
        [event.target.name]: event.target.value,
      },
    };
    setUserData(newData);
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
          oneRepMax: userData.oneRepMax,
        },
      }
    );

    //Api returns updated user data hence updatedOneRepMax.updated
    setUserData(updatedOneRepMax.updated);
    alert(`Successfully created new workout.`);
    return updatedOneRepMax;
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
        setUserData(JSON.parse(sessionStorage.getItem("userData")));
        setLoading(false);
      }
      //Otherwise it will be fetched and then stored in userData
      else {
        let data = await getUserData(Auth);
        if (data) {
          setUserData(data);
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

  const createInputsList = (userData) => {
    const inputList = [];
    for (const lift in userData.oneRepMax) {
      inputList.push(
        <label key={lift} className="flex flex-wrap w-full">
          <span className="w-full text-center font-bold text-gray-400 text-2xl pt-3">
            {lift}
          </span>
          <input
            onChange={handleChange}
            type="number"
            name={lift}
            value={userData.oneRepMax[lift]}
            className="w-1/6 m-auto text-center font-extrabold text-xl bg-gray-900 text-blue-500 shadow-sm"
          ></input>
        </label>
      );
    }
    return inputList;
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center ">
        {/* <span className="text-3xl text-gray-300 font-extrabold m-auto">
          Loading...
        </span> */}
        <div class="lds-roller m-auto">
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
      <form onSubmit={handleSubmit} className="flex flex-wrap w-full pt-10">
        {createInputsList(userData)}
        <input type="submit" id="submitInput" className="hidden" />
        <label htmlFor="submitInput" className="m-auto mt-5 btn-primary">
          Create workout
        </label>
      </form>
    );
  }
};

export default CreateWorkout;
