import { React, useState } from "react";

import {
  calculateIncrementsForWeek,
  calculateBase,
} from "../../helpers/calculateIncrements";

export default function MapLift({ oneRepMax, numberOfWeeks, lift }) {
  const lifts = [];
  const [checks, setChecks] = useState({});

  const handleChecked = (event) => {
    console.log(event.target.dataset);
    setChecks({
      ...checks,
      [event.target.dataset.num]: !checks[event.target.dataset.num],
    });
    event.target.checked
      ? (event.target.parentNode.style.backgroundColor = "limeGreen")
      : (event.target.parentNode.style.backgroundColor = "white");
    console.log(checks);
  };

  for (let i = 1; i <= numberOfWeeks; i++) {
    let increment = calculateIncrementsForWeek(i, calculateBase(oneRepMax));
    increment = increment.map((weight, index) => {
      return (
        <li key={index}>
          <input
            type="checkbox"
            data-num={`${lift}-week${i}-index${index}-weight${weight}`}
            //https://stackoverflow.com/questions/39120007/setting-a-checkbox-check-property-in-react
            //Fist component is based on undefined value so it would throw error
            checked={!!checks[`${lift}-week${i}-index${index}-weight${weight}`]}
            onChange={handleChecked}
          ></input>
          {weight.toString(10).slice(0, 6)}
        </li>
      );
    });
    lifts.push(
      <ul key={i}>
        {`Week ${i}`}
        {increment}
      </ul>
    );
  }

  return lifts;
}
