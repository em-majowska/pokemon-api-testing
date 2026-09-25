import * as pokemonController from "../controllers/pokemonController";
import express from "express";
import {
  createPokemonSchema,
  getPokemonQuerySchema,
  getPokemonSchema,
  updatePokemonSchema,
} from "../validations/pokemonSchemas";
import validate from "../middlewares/validate";

const router = express.Router();

router.get(
  "/",
  validate(getPokemonQuerySchema),
  pokemonController.getAllPokemons,
);
router.get(
  "/:id",
  validate(getPokemonSchema),
  pokemonController.getPokemonById,
);

router.post(
  "/",
  validate(createPokemonSchema),
  pokemonController.createPokemon,
);
router.put(
  "/:id",
  validate(updatePokemonSchema),
  pokemonController.updatePokemon,
);
router.delete(
  "/:id",
  validate(getPokemonSchema),
  pokemonController.deletePokemon,
);

export default router;
