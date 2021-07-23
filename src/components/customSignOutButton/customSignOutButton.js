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

const CustomSignOutButton = () => {
  return (
    <button
      onClick={handleSignOutButtonClick}
      className="btn-primary bg-transparent border-2 border-blue-500"
    >
      Sign out
    </button>
  );
};

export default CustomSignOutButton;
