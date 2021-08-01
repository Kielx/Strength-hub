import React from "react";
import { Link } from "react-router-dom";

import main from "../../assets/images/main.webp";
import logo from "../../assets/images/Strength-hub-logo-md.webp";

export default function Home() {
  return (
    <div className="flex h-full">
      <div className="m-auto max-w-6xl p-12">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 max-w-md flex flex-col justify-center xl:mr-12 lg:-mt-52">
            <Link to="/login">
              <img alt="logo" className="w-3/4 mx-auto" src={logo} />
            </Link>
            <div className="text-xl font-semibold text-gray-400 mt-8 text-center">
              Plan your strength gains. Focus on training. We'll do the rest.
            </div>
            <div className="my-5 h-16 m-auto pt-6">
              <Link
                to="/login"
                className="shadow-md font-medium py-3 px-6 text-white
           cursor-pointer bg-yellow-600 hover:bg-yellow-500 rounded text-lg text-center w-48 transition-colors active:relative active: top-px"
              >
                Join us now
              </Link>
            </div>
          </div>
          <div className="flex md:justify-end w-full md:w-1/2 -mt-5 lg:mt-24 xl:mt-40">
            <div className="bg-dots">
              <div className="shadow-2xl max-w-md z-10 rounded-full mt-6 ml-4">
                <img alt="card img" className="rounded-t" src={main} />
                <div className="text-lg font-semibold p-10 bg-gray-900 text-gray-400 rounded-b">
                  <img
                    alt="quote"
                    className="float-left mr-1"
                    src="https://assets-global.website-files.com/5b5a66e9f3166b36708705fa/5cf8fb1f994fb7168d0d66fb_quote-intro.svg"
                  />{" "}
                  The times when you had to carry your gym notebook with you are
                  gone forever. Now you can easily keep your training diary,
                  plan your weight progression and be sure that you are
                  progressing according to plan. And it's all free.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
