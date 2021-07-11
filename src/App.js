import { React, useState, useEffect } from "react";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import { Auth, API, I18n } from "aws-amplify";
import { dict } from "./helpers/trans";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/Home";
import Workouts from "./pages/workouts/workouts";
import NotFound from "./pages/notFound/NotFound";
import MapLift from "./components/mappedLifts/MapLift";
import OneRepMaxInput from "./components/oneRepMaxInput/OneRepMaxInput";
import useUserStatus from "./components/userStatus";

I18n.putVocabularies(dict);

function App() {
  const userStatus = useUserStatus();
  const isLoggedIn = null !== userStatus;

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
      [event.target.name]: [event.target.value],
    }));
  };

  const createInputsList = (oneRepMax) => {
    const inputList = [];
    for (const lift in oneRepMax) {
      inputList.push(
        <OneRepMaxInput
          key={lift}
          handleChange={handleChange}
          name={lift}
          oneRepMax={oneRepMax[lift]}
        />
      );
    }
    return inputList;
  };

  const createWeightProgressionList = (oneRepMaxObj, numberOfWeeks) => {
    const weightProgressionList = [];
    for (const lift in oneRepMaxObj) {
      weightProgressionList.push(
        <div
          key={lift}
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>{lift}</h2>
          <MapLift
            lift={lift}
            oneRepMax={oneRepMaxObj[lift]}
            numberOfWeeks={numberOfWeeks}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </div>
      );
    }
    return weightProgressionList;
  };

  const logAuth = async (auth) => {
    console.log(auth);
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.username);
    console.log(user.attributes.sub);
  };

  //get api call to get weight progression
  const getOneRepMax = async (auth) => {
    const user = await Auth.currentAuthenticatedUser();
    const oneRepMax = await API.get(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        queryStringParameters: {
          id: `${user.attributes.sub}`,
          name: `${auth.user.username}`,
        },
      }
    );
    console.log(oneRepMax);
    return oneRepMax;
  };

  //post api call to update weight progression
  const updateOneRepMax = async (auth, oneRepMax) => {
    const user = await Auth.currentAuthenticatedUser();
    const updatedOneRepMax = await API.post(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        body: {
          id: `${user.attributes.sub}`,
          name: `${user.username}`,
          oneRepMax,
        },
      }
    );
    console.log(updatedOneRepMax);
    return updatedOneRepMax;
  };

  //delete oneRepMax
  const deleteOneRepMax = async (auth) => {
    const user = await Auth.currentAuthenticatedUser();
    const deletedOneRepMax = await API.del(
      "strengthworkouts",
      "/api/strengthworkouts",
      {
        body: {
          id: `${user.attributes.sub}`,
          name: `${user.username}`,
          oneRepMax,
        },
      }
    );
    console.log(deletedOneRepMax);
    return deletedOneRepMax;
  };

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Header isLoggedIn={isLoggedIn} />
          <Home />
        </Route>
        <Route path="/login">
          {isLoggedIn ? (
            <Redirect to="/workouts" />
          ) : (
            <AmplifyAuthenticator>
              <AmplifySignIn></AmplifySignIn>
            </AmplifyAuthenticator>
          )}
        </Route>
        <Route exact path="/workouts">
          {isLoggedIn ? (
            <>
              <Header isLoggedIn={isLoggedIn} />
              <Workouts />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <button onClick={() => logAuth(Auth)}> Log in with Auth0</button>
      <button onClick={() => getOneRepMax(Auth)}> GetoneRepMax</button>
      <button onClick={() => updateOneRepMax(Auth, 140)}>
        UpdateOneRepMax
      </button>
      <button onClick={() => deleteOneRepMax(Auth)}>Delete one rep max</button>

      {createInputsList(oneRepMax)}
      <div
        style={{
          display: "flex",
        }}
      >
        {createWeightProgressionList(oneRepMax, 6)}
      </div>
    </>
  );
}

export default App;
