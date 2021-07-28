import { React, useState } from "react";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import { I18n, Auth, API } from "aws-amplify";
import { dict } from "./helpers/trans";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/home/Home";
import CreateWorkout from "./pages/createWorkout/CreateWorkout";
import MyWorkout from "./pages/myWorkout/MyWorkout";
import NotFound from "./pages/notFound/NotFound";
import Header from "./components/header/header";
import Navbar from "./components/navbar/Navbar";
import useIsLoggedIn from "./components/userStatus";

I18n.putVocabularies(dict);

function App() {
  const isLoggedIn = useIsLoggedIn();
  const [userData, setUserData] = useState({});
  const [saved, setSaved] = useState(false);

  const saveData = async function () {
    let res = false;
    if (
      //Checks if sessionstorage has userData AND if userData is not empty (because API returns empty object if no data is found)
      sessionStorage.getItem("userData") &&
      Object.keys(JSON.parse(sessionStorage.getItem("userData"))).length
    ) {
      const user = await Auth.currentAuthenticatedUser();
      res = await API.post("strengthworkouts", "/api/strengthworkouts/update", {
        body: {
          id: `${user.attributes.sub}`,
          name: `${Auth.user.username}`,
          oneRepMax: userData.oneRepMax,
          fiveThreeOne: userData.fiveThreeOne,
        },
      });
    }
    if (res) {
      console.log(res);
      setSaved(true);
      const newFiveThreeOne = res.updated.fiveThreeOne;
      setUserData({ ...userData, fiveThreeOne: newFiveThreeOne });
      console.log(userData);
      setTimeout(() => {
        setSaved(false);
      }, 5000);
    }
  };

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
              <Navbar></Navbar>
              <Header
                isLoggedIn={isLoggedIn}
                saveData={saveData}
                saved={saved}
              />
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
              <Header
                isLoggedIn={isLoggedIn}
                saveData={saveData}
                saved={saved}
              />
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
            <Redirect to="/my-workout" />
          ) : (
            <AmplifyAuthenticator>
              <AmplifySignIn></AmplifySignIn>
            </AmplifyAuthenticator>
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
