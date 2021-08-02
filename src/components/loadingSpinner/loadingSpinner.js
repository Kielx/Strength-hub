import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex w-full h-screen items-center ">
      {/* <span className="text-3xl text-gray-300 font-extrabold m-auto">
          Loading...
        </span> */}
      <div className="lds-roller m-auto">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
