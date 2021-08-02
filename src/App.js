import { React, useState, Suspense, lazy } from "react";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import { I18n, Auth, API } from "aws-amplify";
import { dict } from "./helpers/trans";
import { Switch, Route, Redirect } from "react-router-dom";
import useIsLoggedIn from "./components/userStatus";
import LoadingSpinner from "./components/loadingSpinner/loadingSpinner";
const Home = lazy(() => import("./pages/home/Home"));
const CreateWorkout = lazy(() => import("./pages/createWorkout/CreateWorkout"));
const MyWorkout = lazy(() => import("./pages/myWorkout/MyWorkout"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));
const Navbar = lazy(() => import("./components/navbar/Navbar"));

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
      setSaved(true);
      const newFiveThreeOne = res.updated.fiveThreeOne;
      setUserData({ ...userData, fiveThreeOne: newFiveThreeOne });
      setTimeout(() => {
        setSaved(false);
      }, 5000);
    }
  };

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route exact path="/">
            <>
              <Home />
            </>
          </Route>
          <Route exact path="/create-workout">
            {isLoggedIn ? (
              <>
                <Navbar saved={saved}></Navbar>
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
                <Navbar
                  isLoggedIn={isLoggedIn}
                  saveData={saveData}
                  saved={saved}
                ></Navbar>

                <MyWorkout
                  userData={userData}
                  setUserData={setUserData}
                  saveData={saveData}
                  isLoggedIn={isLoggedIn}
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
      </Suspense>
    </>
  );
}

export default App;
