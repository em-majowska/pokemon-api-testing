import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error.stack);
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erreur de validation",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: "Erreur de validation", errors });
  }

  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ message: `Valeur invalide pour le champ ${error.path}` });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res
      .status(409)
      .json({ message: `Le champ ${field} est déjà utilisé`, field });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return res.status(500).json({ message: "Erreur interne du serveur" });
};

export default errorHandler;
