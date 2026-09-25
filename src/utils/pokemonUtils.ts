import { MAX_TEAM_SIZE } from "../constants";

export const isTeamFull = (teamSize: number): boolean =>
  teamSize === MAX_TEAM_SIZE;

export const getAverageLevel = (levels: number[]): number => {
  if (levels.length === 0) {
    return 0;
  }
  const sum = levels.reduce((prev, curr) => prev + curr, 0);
  return Math.round(sum / levels.length);
};
