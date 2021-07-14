import { React } from "react";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react";
import { I18n } from "aws-amplify";
import { dict } from "./helpers/trans";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./pages/home/Home";
import Workouts from "./pages/workouts/workouts";
import NotFound from "./pages/notFound/NotFound";

import useUserStatus from "./components/userStatus";

I18n.putVocabularies(dict);

function App() {
  const userStatus = useUserStatus();
  const isLoggedIn = null !== userStatus;

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
    </>
  );
}

export default App;
