import { Link } from "react-router-dom";
import { AmplifySignOut } from "@aws-amplify/ui-react";

const header = ({ isLoggedIn }) => {
  return (
    <header
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "1vw",
      }}
    >
      <h1>Strength-Hub</h1>
      {isLoggedIn ? (
        <>
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/workouts">
            <button>Workouts</button>
          </Link>
        </>
      ) : null}
      {isLoggedIn ? (
        <AmplifySignOut onClick={() => sessionStorage.clear()} />
      ) : (
        <Link to="/login">
          {" "}
          <button>Login</button>
        </Link>
      )}
    </header>
  );
};

export default header;
