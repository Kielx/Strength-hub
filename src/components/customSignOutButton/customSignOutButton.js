import React from "react";
import { Auth, Hub } from "aws-amplify";

//https://github.com/aws-amplify/amplify-js/issues/7039

const handleSignOutButtonClick = async () => {
  try {
    await Auth.signOut();
    Hub.dispatch("UI Auth", {
      // channel must be 'UI Auth'
      event: "AuthStateChange", // event must be 'AuthStateChange'
      message: "signedout", // message must be 'signedout'
    });
    sessionStorage.clear();
  } catch (error) {
    console.log("error signing out: ", error);
  }
};

const CustomSignOutButton = ({ active }) => {
  return (
    <a
      onClick={handleSignOutButtonClick}
      className={`${
        active ? "bg-gray-800 text-yellow-500" : ""
      }block px-4 py-2 text-sm text-gray-300 cursor-pointer hover:bg-gray-900 hover:text-yellow-500`}
    >
      Sign out
    </a>
  );
};

export default CustomSignOutButton;
