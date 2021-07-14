/**********************
 * Helper Functions *
 **********************/

function calculateIncrementsForWeek(weekNumber, oneRepMax) {
  const baseWeight = oneRepMax * 0.9;
  if (
    weekNumber < 1 ||
    baseWeight < 0 ||
    isNaN(weekNumber) ||
    isNaN(baseWeight)
  ) {
    return undefined;
  }
  let calculatedWeights;
  //Calculate base weights for given week from range of 1 to 4;
  switch ((weekNumber - 1) % 4) {
    case 0:
      calculatedWeights = {
        increments: [baseWeight * 0.65, baseWeight * 0.75, baseWeight * 0.85],
        reps: [5, 5, 5],
        done: [false, false, false],
      };
      break;
    case 1:
      calculatedWeights = {
        increments: [baseWeight * 0.7, baseWeight * 0.8, baseWeight * 0.9],
        reps: [3, 3, 3],
        done: [false, false, false],
      };
      break;
    case 2:
      calculatedWeights = {
        increments: [baseWeight * 0.75, baseWeight * 0.85, baseWeight * 0.95],
        reps: [5, 3, 1],
        done: [false, false, false],
      };
      break;
    case 3:
      calculatedWeights = {
        increments: [baseWeight * 0.4, baseWeight * 0.5, baseWeight * 0.6],
        reps: [5, 5, 5],
        done: [false, false, false],
      };
      break;
    /* istanbul ignore next */
    default:
      break;
  }
  //Increase calculated weights according to actual week passed
  //For each four weeks, we increase the weight by 2.5
  var quotient = Math.floor((weekNumber - 1) / 4);
  calculatedWeights.increments = calculatedWeights.increments.map((weight) => {
    return weight !== 0 ? (weight += 2.5 * quotient) : 0;
  });
  return calculatedWeights;
}

const mapLifts = function (oneRepMax, currentWeek) {
  const lifts = {};
  currentWeek = parseInt(currentWeek, 10);
  let begin = currentWeek <= 3 ? 1 : currentWeek - 2;
  for (let i = 1; i <= begin + 4; i++) {
    for (const [key, value] of Object.entries(oneRepMax)) {
      //Check if objects and properties are defined, if not set to empty
      //https://stackoverflow.com/questions/17643965/how-to-automatically-add-properties-to-an-object-that-is-undefined
      if (key !== "Current Week") {
        lifts[`week ${i}`] = lifts[`week ${i}`] || {};
        lifts[`week ${i}`][key] = lifts[`week ${i}`][key] || {};
        lifts[`week ${i}`][key] = {
          increments: calculateIncrementsForWeek(i, value).increments,
          reps: calculateIncrementsForWeek(i, value).reps,
          done: calculateIncrementsForWeek(i, value).done,
        };
      }
    }
  }
  return lifts;
};

module.exports = {
  calculateIncrementsForWeek: calculateIncrementsForWeek,
  mapLifts: mapLifts,
};
