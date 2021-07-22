import { React, useEffect, useState } from "react";
import { Auth, API } from "aws-amplify";

const CreateWorkout = ({ userData, setUserData }) => {
  const [loading, setLoading] = useState(true);

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

  const handleChange = (event) => {
    console.log(userData);

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

    setUserData(updatedOneRepMax.updated);

    return updatedOneRepMax;
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (sessionStorage.getItem("userData")) {
        setUserData(JSON.sort(JSON.parse(sessionStorage.getItem("userData"))));
      } else {
        let data = await getUserData(Auth);
        setUserData(data);
      }
      setLoading(false);
    }
    fetchData();
  }, [setUserData]);

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
        <span className="text-3xl text-gray-300 font-extrabold m-auto">
          Loading...
        </span>
      </div>
    );
  } else {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap">
        {createInputsList(userData)}

        <input type="submit" id="submitInput" className="hidden" />
        <label
          htmlFor="submitInput"
          className="m-auto mt-6 shadow-md font-medium py-3 px-6 text-blue-100
         cursor-pointer bg-blue-600 hover:bg-blue-500 rounded text-lg text-center w-48 transition-colors active:relative active: top-px"
        >
          Submit
        </label>
      </form>
    );
  }
};

export default CreateWorkout;
