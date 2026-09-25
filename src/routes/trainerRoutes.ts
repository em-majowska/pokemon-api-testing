import * as trainerController from "../controllers/trainerController";
import express from "express";
import validate from "../middlewares/validate";
import {
  createTrainerSchema,
  getTrainerSchema,
  updateTrainerSchema,
} from "../validations/trainerSchemas";

const router = express.Router();

router.get("/", trainerController.getAllTrainers);
router.get(
  "/:id",
  validate(getTrainerSchema),
  trainerController.getTrainerById,
);
router.get(
  "/:id/pokemons",
  validate(getTrainerSchema),
  trainerController.getTrainerTeam,
);

router.post(
  "/",
  validate(createTrainerSchema),
  trainerController.createTrainer,
);
router.put(
  "/:id",
  validate(updateTrainerSchema),
  trainerController.updateTrainer,
);
router.delete(
  "/:id",
  validate(getTrainerSchema),
  trainerController.deleteTrainer,
);

export default router;
