import z from "zod";
import { REGIONS } from "../constants";

export const trainerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name is too short (at least 3 characters)")
    .max(20, "Name should be between 3-20 characters long"),
  age: z
    .number()
    .int()
    .min(10, "Trainer should be at least 10 years old")
    .max(99, "Trainer is too old (max 99) 😜"),
  region: z.enum(
    REGIONS,
    "Region should be one of : Kanto, Johto, Hoenn, Sinnoh",
  ),
  badges: z
    .number()
    .int()
    .min(0, "Trainer cannot have negative number of badges")
    .max(8, "Trainer cannot have more than 8 badges")
    .default(0),
});

export type TTrainer = z.infer<typeof trainerBodySchema>;
