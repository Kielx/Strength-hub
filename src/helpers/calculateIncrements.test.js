const calculateIncrements = require("./calculateIncrements");

test("Properly calculates base for increments", () => {
  expect(calculateIncrements.calculateBase(120)).toBe(108);
});

test("Properly calculates increments for given week", () => {
  expect(calculateIncrements.calculateIncrementsForWeek(1, 108)).toEqual(
    expect.arrayContaining([70.2, 81, 91.8])
  );
  expect(calculateIncrements.calculateIncrementsForWeek(2, 108)).toEqual(
    expect.arrayContaining([75.6, 86.4, 97.2])
  );
  expect(calculateIncrements.calculateIncrementsForWeek(3, 108)).toEqual(
    expect.arrayContaining([81, 91.8, 102.6])
  );
  expect(calculateIncrements.calculateIncrementsForWeek(4, 108)).toEqual(
    expect.arrayContaining([43.2, 54, 64.8])
  );
  expect(calculateIncrements.calculateIncrementsForWeek(7, 108)).toEqual(
    expect.arrayContaining([83.5, 94.3, 105.1])
  );
  expect(calculateIncrements.calculateIncrementsForWeek(12, 108)).toEqual(
    expect.arrayContaining([48.2, 59, 69.8])
  );
});
