import { Link } from "react-router-dom";
import CustomSignOutButton from "../customSignOutButton/customSignOutButton";

const header = ({ isLoggedIn, saveData, saved }) => {
  return (
    <>
      <header className="hidden md:flex items-center gap-7 text-gray-400 font-bold px-20 py-6 justify-between">
        {
          //Normal screen
        }

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
      {
        //Responsive screen
      }
      <header className="flex gap-7 text-gray-400 font-bold justify-end px-10 pt-10 items-center justify-between">
        <h1 className="font-extrabold text-2xl text-gray-300 uppercase">
          Strength-Hub
        </h1>
        <div className="relative md:hidden">
          <input type="checkbox" id="sortbox" className="hidden absolute" />
          <label
            htmlFor="sortbox"
            className="flex items-center space-x-1 cursor-pointer"
          >
            <svg width="24" height="18" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 16v2H0v-2h24zm0-8v2H0V8h24zm0-8v2H0V0h24z"
                fill="#fff"
                fillRule="evenodd"
              />
            </svg>
          </label>

          <div
            id="sortboxmenu"
            className="absolute w-screen pb-4 pt-8 right-1 top-16 opacity-0 bg-gray-900 text-gray-400 transition delay-75 ease-in-out z-10"
            style={{ right: "-40px" }}
          >
            <div className="flex flex-col align-middle gap-7 items-center text-lg ">
              {isLoggedIn ? (
                <>
                  <Link
                    className="transition-colors hover:text-gray-100"
                    to="/"
                  >
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
          </div>
        </div>
      </header>
      <div
        class={`bg-indigo-900 text-center py-4 lg:px-4 ${
          saved ? "absolute inset-x-0 md:top-20 top-32" : "hidden"
        }`}
      >
        <div
          class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
          role="alert"
        >
          <span class="flex rounded-full bg-indigo-600 uppercase px-2 py-1 text-xs font-bold mr-3">
            SUCCESS
          </span>
          <span class="font-semibold mr-2 text-left flex-auto">
            Your workout was saved!
          </span>
        </div>
      </div>
    </>
  );
};

export default header;
