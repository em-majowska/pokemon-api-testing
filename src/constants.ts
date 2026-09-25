export const REGIONS = ["Kanto", "Johto", "Hoenn", "Sinnoh"] as const;
export const POKEMON_TYPES = [
  "feu",
  "eau",
  "plante",
  "electrik",
  "psy",
  "normal",
] as const;
export const MAX_TEAM_SIZE = 6;

export type Region = (typeof REGIONS)[number];
export type PokemonType = (typeof POKEMON_TYPES)[number];
