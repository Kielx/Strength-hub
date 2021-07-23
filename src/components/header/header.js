import { Link } from "react-router-dom";
import CustomSignOutButton from "../customSignOutButton/customSignOutButton";

const header = ({ isLoggedIn, saveData }) => {
  return (
    <header className="flex items-center gap-7 text-gray-400 font-bold px-20 py-6 justify-between">
      <h1 className="font-extrabold text-4xl text-gray-300 uppercase">
        Strength-Hub
      </h1>
      <div className="flex align-middle gap-7 items-center text-lg ">
        {isLoggedIn ? (
          <>
            <Link className="transition-colors hover:text-gray-100" to="/">
              Home
            </Link>
            <Link
              className="transition-colors hover:text-gray-100"
              to="/create-workout"
            >
              Create Workout
            </Link>
            <Link
              className="transition-colors hover:text-gray-100"
              to="/my-workout"
            >
              My Workout
            </Link>
          </>
        ) : null}
        {isLoggedIn ? (
          <>
            <button className="btn-primary" onClick={saveData}>
              Save workout
            </button>
            <CustomSignOutButton> </CustomSignOutButton>
          </>
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
