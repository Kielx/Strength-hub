import { React, useState } from "react";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import { I18n } from "aws-amplify";
import { dict } from "./helpers/trans";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/Home";
import Workouts from "./pages/workouts/workouts";
import NotFound from "./pages/notFound/NotFound";

import useIsLoggedIn from "./components/userStatus";
import CreateWorkout from "./pages/createWorkout/CreateWorkout";
import MyWorkout from "./pages/myWorkout/MyWorkout";

I18n.putVocabularies(dict);

function App() {
  const isLoggedIn = useIsLoggedIn();
  const [userData, setUserData] = useState({});

  return (
    <>
      <Switch>
        <Route exact path="/">
          <>
            <Home />
          </>
        </Route>
        <Route exact path="/create-workout">
          {isLoggedIn ? (
            <>
              <Header isLoggedIn={isLoggedIn} />
              <CreateWorkout
                userData={userData}
                setUserData={setUserData}
              ></CreateWorkout>
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/my-workout">
          {isLoggedIn ? (
            <>
              <Header isLoggedIn={isLoggedIn} />
              <MyWorkout
                userData={userData}
                setUserData={setUserData}
              ></MyWorkout>
            </>
          ) : (
            <Redirect to="/login" />
          )}
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
              <Workouts userData={userData} setUserData={setUserData} />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
