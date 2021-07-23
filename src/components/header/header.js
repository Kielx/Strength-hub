import { Link } from "react-router-dom";
import { AmplifySignOut } from "@aws-amplify/ui-react";

const header = ({ isLoggedIn }) => {
  return (
    <header className="flex items-center gap-7 text-gray-400 font-bold px-20 py-6 justify-between">
      <h1 className="font-extrabold text-4xl text-gray-300">Strength-Hub</h1>
      <div className="flex align-middle gap-7 items-center">
        {isLoggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/workouts">Workouts</Link>
            <Link to="/create-workout">Create Workout</Link>
            <Link to="/my-workout">My Workout</Link>
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
      </div>
    </header>
  );
};

export default header;
