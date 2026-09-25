import express from "express";
import trainerRouter from "./routes/trainerRoutes";
import pokemonRouter from "./routes/pokemonRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.use("/api/trainers", trainerRouter);
app.use("/api/pokemons", pokemonRouter);

app.use(errorHandler);

export default app;
