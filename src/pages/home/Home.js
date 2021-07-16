import React from "react";
import { Link } from "react-router-dom";

import main from "../../assets/images/main.jpg";

export default function Home() {
  return (
    <div className="flex h-full">
      <div className="m-auto max-w-6xl p-12">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 max-w-md flex flex-col justify-center">
            <div className="md:text-5xl text-2xl uppercase font-black">
              Plan your strength gains
            </div>
            <div className="text-xl mt-4">
              Focus on training. We'll do the rest. Made by athletes for
              athletes.
            </div>
            <div className="my-5 h-16">
              <div
                className="shadow-md font-medium py-2 px-4 text-yellow-100
           cursor-pointer bg-yellow-600 hover:bg-yellow-500 rounded text-lg text-center w-48"
              >
                <Link to="/login">Join us now</Link>
              </div>
            </div>
          </div>
          <div className="flex md:justify-end w-full md:w-1/2 -mt-5">
            <div className="bg-dots">
              <div className="shadow-2xl max-w-md z-10 rounded-full mt-6 ml-4">
                <img alt="card img" className="rounded-t" src={main} />
                <div className="text-lg p-10 bg-white">
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
