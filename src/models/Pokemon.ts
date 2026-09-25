import mongoose, { Document, model, Schema } from "mongoose";
import { POKEMON_TYPES } from "../constants";
import { TPokemon } from "../validations/pokemonSchemas";

export type TPokemonDocument = TPokemon & Document;

const pokemonSchema = new Schema<TPokemonDocument>(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    type: { type: String, required: true, enum: POKEMON_TYPES },
    level: { type: Number, default: 1, min: 1, max: 100 },
    trainerId: { type: mongoose.Types.ObjectId, ref: "Trainer", default: null },
  },
  { timestamps: true },
);

export default model<TPokemonDocument>("Pokemon", pokemonSchema);
