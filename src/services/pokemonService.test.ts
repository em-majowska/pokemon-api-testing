import Pokemon from "../models/Pokemon";
import Trainer from "../models/Trainer";
import * as pokemonService from "../services/pokemonService";
import { TPokemon } from "../validations/pokemonSchemas";

jest.mock("../models/Trainer");
jest.mock("../models/Pokemon");
const MockedTrainer = Trainer as jest.Mocked<typeof Trainer>;
const MockedPokemon = Pokemon as jest.Mocked<typeof Pokemon>;

const fakePokemons = [
  {
    _id: "abc12",
    name: "Pikachu",
    type: "electrik",
    level: 15,
    trainerId: "t1",
  },
  {
    _id: "abc2",
    name: "Raichu",
    type: "electrik",
    level: 36,
    trainerId: null,
  },
  {
    _id: "abc3",
    name: "Raichu",
    type: "plante",
    level: 36,
    trainerId: null,
  },
];

const fakeTrainer = {
  _id: "t1",
  name: "Ondine",
  age: 12,
  region: "Kanto",
  badges: 4,
};

describe("pokemonService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ====================================================
  // =================== GET ALL ========================
  // ====================================================

  describe("getAllPokemons", () => {
    test("should return empty array if no pokemons", async () => {
      (MockedPokemon.find as jest.Mock).mockResolvedValue([]);

      const res = await pokemonService.getAllPokemons();

      expect(MockedPokemon.find).toHaveBeenCalledTimes(1);
      expect(res).toEqual([]);
    });

    test("should return array pokemons", async () => {
      (MockedPokemon.find as jest.Mock).mockResolvedValue(fakePokemons);

      const res = await pokemonService.getAllPokemons();

      expect(MockedPokemon.find).toHaveBeenCalledTimes(1);
      expect(res).toHaveLength(3);
      expect(res).toMatchObject(fakePokemons);
    });
    test("should return array filtered pokemons", async () => {
      (MockedPokemon.find as jest.Mock).mockResolvedValue([fakePokemons[2]]);

      const res = await pokemonService.getAllPokemons({ type: "plante" });

      expect(MockedPokemon.find).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.find).toHaveBeenCalledWith({ type: "plante" });
      expect(res).toHaveLength(1);
      expect(res).toMatchObject([fakePokemons[2]]);
    });
  });

  // ====================================================
  // =================== GET BY ID ======================
  // ====================================================

  describe("getPokemonById", () => {
    test("should return null if pokemon not found", async () => {
      (MockedPokemon.findById as jest.Mock).mockResolvedValue(null);

      const res = await pokemonService.getPokemonById("fakeId");

      expect(MockedPokemon.findById).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findById).toHaveBeenCalledWith("fakeId");
      expect(res).toBeFalsy();
    });

    test("should return a pokemon", async () => {
      (MockedPokemon.findById as jest.Mock).mockResolvedValue(fakePokemons[0]);

      const res = await pokemonService.getPokemonById("abc12");

      expect(MockedPokemon.findById).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findById).toHaveBeenCalledWith("abc12");
      expect(res).toEqual(fakePokemons[0]);
    });
  });

  // ====================================================
  // =================== CREATE =========================
  // ====================================================

  describe("createPokemon", () => {
    test("should create a pokemon in database for trainerId null", async () => {
      const pokemonData: TPokemon = {
        name: "Pikachu",
        type: "electrik",
        level: 15,
        trainerId: null,
      };

      const savedPokemon = {
        _id: "abc12",
        ...pokemonData,
      };

      (MockedPokemon.create as jest.Mock).mockResolvedValue(savedPokemon);

      const res = await pokemonService.createPokemon(pokemonData);

      expect(MockedPokemon.create).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.create).toHaveBeenCalledWith(pokemonData);
      expect(res).toMatchObject(pokemonData);
    });
    test("should create a pokemon in database for specific trainer", async () => {
      const pokemonData: TPokemon = {
        name: "Pikachu",
        type: "electrik",
        level: 15,
        trainerId: "t1",
      };

      const savedPokemon = {
        _id: "abc12",
        ...pokemonData,
      };

      (MockedTrainer.findById as jest.Mock).mockResolvedValue(fakeTrainer);
      (MockedPokemon.create as jest.Mock).mockResolvedValue(savedPokemon);

      const res = await pokemonService.createPokemon(pokemonData);

      expect(MockedPokemon.create).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.create).toHaveBeenCalledWith(pokemonData);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("t1");
      expect(res).toMatchObject(pokemonData);
    });
    test("should throw error if specific trainer is not found", async () => {
      const pokemonData: TPokemon = {
        name: "Pikachu",
        type: "electrik",
        level: 15,
        trainerId: "t1",
      };

      const savedPokemon = {
        _id: "abc12",
        ...pokemonData,
      };

      (MockedTrainer.findById as jest.Mock).mockResolvedValue(null);
      (MockedPokemon.create as jest.Mock).mockResolvedValue(savedPokemon);

      await expect(pokemonService.createPokemon(pokemonData)).rejects.toThrow(
        "Le dresseur correspondant à cet ID n'existe pas",
      );
      expect(MockedTrainer.findById).toHaveBeenCalledWith("t1");
      expect(MockedPokemon.create).not.toHaveBeenCalled();
    });
    test("should throw error if specific trainer has max number of pokemons", async () => {
      const fakePokemons = [
        {
          _id: "abc12",
          name: "Pikachu",
          type: "electrik",
          level: 15,
          trainerId: "t1",
        },
        {
          _id: "abc2",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "t1",
        },
        {
          _id: "abc3",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "t1",
        },
        {
          _id: "abc4",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "t1",
        },
        {
          _id: "abc5",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "t1",
        },
        {
          _id: "abc6",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "t1",
        },
      ];
      const pokemonData: TPokemon = {
        name: "Pikachu",
        type: "electrik",
        level: 15,
        trainerId: "t1",
      };

      const savedPokemon = {
        _id: "abc12",
        ...pokemonData,
      };

      (MockedTrainer.findById as jest.Mock).mockResolvedValue(fakeTrainer);
      (MockedPokemon.find as jest.Mock).mockResolvedValue(fakePokemons);
      (MockedPokemon.create as jest.Mock).mockResolvedValue(savedPokemon);

      await expect(pokemonService.createPokemon(pokemonData)).rejects.toThrow(
        "Un dresseur peut avoir un maximum de 6 pokémons. Limite atteinte.",
      );
      expect(MockedTrainer.findById).toHaveBeenCalledWith("t1");
      expect(MockedPokemon.find).toHaveBeenCalledWith({ trainerId: "t1" });
      expect(MockedPokemon.create).not.toHaveBeenCalled();
    });
  });

  // ====================================================
  // =================== UPDATE =========================
  // ====================================================

  describe("updatePokemon", () => {
    test("should return null if pokemon not found", async () => {
      const data = {
        type: "plante",
      };
      (MockedPokemon.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const res = await pokemonService.updatePokemon("fakeId", data as any);

      expect(MockedPokemon.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findByIdAndUpdate).toHaveBeenCalledWith(
        "fakeId",
        data,
        { returnDocument: "after" },
      );
      expect(res).toBeFalsy();
    });

    test("should return updated pokemon", async () => {
      const data = {
        type: "plante",
      };
      const updatedPokemon = {
        _id: "abc5",
        name: "Raichu",
        type: "plante",
        level: 36,
        trainerId: "t1",
      };

      (MockedPokemon.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedPokemon,
      );

      const res = await pokemonService.updatePokemon("abc1", data as any);

      expect(MockedPokemon.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findByIdAndUpdate).toHaveBeenCalledWith(
        "abc1",
        data,
        { returnDocument: "after" },
      );
      expect(res?.type).toBe("plante");
    });
  });

  // ====================================================
  // =================== DELETE =========================
  // ====================================================

  describe("deletePokemon", () => {
    test("should return null if pokemon not found", async () => {
      (MockedPokemon.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      const res = await pokemonService.deletePokemon("fakeId");

      expect(MockedPokemon.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findByIdAndDelete).toHaveBeenCalledWith("fakeId");
      expect(res).toBeFalsy();
    });

    test("should return deleted pokemon", async () => {
      (MockedPokemon.findByIdAndDelete as jest.Mock).mockResolvedValue(
        fakePokemons[0],
      );

      const res = await pokemonService.deletePokemon("abc1");

      expect(MockedPokemon.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(MockedPokemon.findByIdAndDelete).toHaveBeenCalledWith("abc1");
      expect(res).toEqual(fakePokemons[0]);
    });
  });
});
