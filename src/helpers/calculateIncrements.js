function calculateBase(oneRepMax) {
  //Calculate base weight for further calculations (sic!).
  //It is 0.9 * 1RepMax
  const baseWeight = oneRepMax * 0.9;
  return baseWeight;
}

function calculateIncrementsForWeek(weekNumber, baseWeight) {
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
      calculatedWeights = [
        baseWeight * 0.65,
        baseWeight * 0.75,
        baseWeight * 0.85,
      ];
      break;
    case 1:
      calculatedWeights = [
        baseWeight * 0.7,
        baseWeight * 0.8,
        baseWeight * 0.9,
      ];
      break;
    case 2:
      calculatedWeights = [
        baseWeight * 0.75,
        baseWeight * 0.85,
        baseWeight * 0.95,
      ];
      break;
    case 3:
      calculatedWeights = [
        baseWeight * 0.4,
        baseWeight * 0.5,
        baseWeight * 0.6,
      ];
      break;
    /* istanbul ignore next */
    default:
      break;
  }
  //Increase calculated weights according to actual week passed
  //For each four weeks, we increase the weight by 2.5
  var quotient = Math.floor((weekNumber - 1) / 4);
  calculatedWeights = calculatedWeights.map((weight) => {
    return weight != 0 ? (weight += 2.5 * quotient) : 0;
  });
  return calculatedWeights;
}

exports.calculateBase = calculateBase;
exports.calculateIncrementsForWeek = calculateIncrementsForWeek;
