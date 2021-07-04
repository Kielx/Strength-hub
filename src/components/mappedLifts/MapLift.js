import React from "react";

import {
  calculateIncrementsForWeek,
  calculateBase,
} from "../../helpers/calculateIncrements";

export default function MapLift({ oneRepMax, numberOfWeeks }) {
  const lifts = [];
  for (let i = 1; i <= numberOfWeeks; i++) {
    let increment = calculateIncrementsForWeek(i, calculateBase(oneRepMax));
    increment = increment.map((weight) => {
      return (
        <>
          <li>
            <input type="checkbox"></input>
            {weight.toString(10).slice(0, 6)}
          </li>
        </>
      );
    });
    lifts.push(
      <ul>
        {`Week ${i}`}
        {increment}
      </ul>
    );
  }

  return lifts;
}
