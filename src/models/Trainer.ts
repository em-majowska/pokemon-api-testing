import { Document, model, Schema } from "mongoose";
import { REGIONS } from "../constants";
import { TTrainer } from "../validations/trainerSchemas";

export type TTrainerDocument = TTrainer & Document;

const trainerSchema = new Schema<TTrainerDocument>(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      unique: true,
    },
    age: { type: Number, required: true, min: 10, max: 99 },
    region: { type: String, enum: REGIONS },
    badges: { type: Number, min: 0, max: 8, default: 0 },
  },
  { timestamps: true },
);

export default model<TTrainerDocument>("Trainer", trainerSchema);
