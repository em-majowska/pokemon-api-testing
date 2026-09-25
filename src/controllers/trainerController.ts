import { NextFunction, Request, Response } from "express";
import * as trainerService from "../services/trainerService";
import { TTrainer } from "../validations/trainerSchemas";
import HttpError from "../utils/httpError";
import { TObjectId } from "../constants";

export const getAllTrainers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const trainers = await trainerService.getAllTrainers();
    res.status(200).json(trainers);
  } catch (error) {
    next(error);
  }
};

export const getTrainerById = async (
  req: Request<{ id: TObjectId }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const trainer = await trainerService.getTrainerById(req.params.id);
    if (!trainer) {
      throw new HttpError("Dresseur non trouvé", 404);
    }
    res.status(200).json(trainer);
  } catch (error) {
    next(error);
  }
};

export const getTrainerTeam = async (
  req: Request<{ id: TObjectId }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const team = await trainerService.getTrainerTeam(req.params.id);

    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
};

export const createTrainer = async (
  req: Request<{}, TTrainer>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const trainer = await trainerService.createTrainer(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
};

export const updateTrainer = async (
  req: Request<{ id: TObjectId }, Partial<TTrainer>>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const trainer = await trainerService.updateTrainer(req.params.id, req.body);
    if (!trainer) {
      throw new HttpError("Dresseur non trouvé", 404);
    }
    res.status(200).json(trainer);
  } catch (error) {
    next(error);
  }
};

export const deleteTrainer = async (
  req: Request<{ id: TObjectId }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const trainer = await trainerService.deleteTrainer(req.params.id);
    if (!trainer) {
      throw new HttpError("Dresseur non trouvé", 404);
    }
    res.status(204).json(trainer);
  } catch (error) {
    next(error);
  }
};
