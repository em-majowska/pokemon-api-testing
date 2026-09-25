import { getAverageLevel, isTeamFull } from "./pokemonUtils";

describe("isTeamFull", () => {
  test("should return false for 0 as an argument", () => {
    expect(isTeamFull(0)).toBeFalsy();
  });
  test("should return true for 6 as an argument", () => {
    expect(isTeamFull(6)).toBeTruthy();
  });
});
describe("getAverageLevel", () => {
  test("should return 0 for an empty array", () => {
    expect(getAverageLevel([])).toBe(0);
  });
  test("should round down for a sum of numbers with decimals < 0.5", () => {
    expect(getAverageLevel([10, 2, 38, 23, 38, 23, 21])).toBe(22);
  });
  test("should round up for a sum  of numbers with decimals => 0.5", () => {
    expect(getAverageLevel([10, 2, 38, 23, 2, 7, 21])).toBe(15);
  });
});
