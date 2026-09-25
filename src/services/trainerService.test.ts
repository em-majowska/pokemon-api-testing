import Pokemon from "../models/Pokemon";
import Trainer from "../models/Trainer";
import * as trainerService from "../services/trainerService";
import { TTrainer } from "../validations/trainerSchemas";

jest.mock("../models/Trainer");
jest.mock("../models/Pokemon");
const MockedTrainer = Trainer as jest.Mocked<typeof Trainer>;
const MockedPokemon = Pokemon as jest.Mocked<typeof Pokemon>;

describe("trainerService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ====================================================
  // =================== GET ALL ========================
  // ====================================================

  describe("getAllTrainers", () => {
    test("should return empty array if no trainers", async () => {
      (MockedTrainer.find as jest.Mock).mockResolvedValue([]);

      const res = await trainerService.getAllTrainers();

      expect(MockedTrainer.find).toHaveBeenCalledTimes(1);
      expect(res).toEqual([]);
    });

    test("should return array trainers", async () => {
      const fakeTrainers = [
        {
          _id: "abc12",
          name: "Ondine",
          age: 12,
          region: "Kanto",
          badges: 4,
        },
        {
          _id: "abc2",
          name: "Pierre",
          age: 15,
          region: "Kanto",
          badges: 1,
        },
      ];

      (MockedTrainer.find as jest.Mock).mockResolvedValue(fakeTrainers);

      const res = await trainerService.getAllTrainers();

      expect(MockedTrainer.find).toHaveBeenCalledTimes(1);
      expect(res).toMatchObject(fakeTrainers);
    });
  });

  // ====================================================
  // =================== GET BY ID ======================
  // ====================================================

  describe("getTrainerById", () => {
    test("should return null if trainer not found", async () => {
      (MockedTrainer.findById as jest.Mock).mockResolvedValue(null);

      const res = await trainerService.getTrainerById("fakeId");

      expect(MockedTrainer.findById).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("fakeId");
      expect(res).toBeFalsy();
    });

    test("should return a trainer", async () => {
      const fakeTrainers = [
        {
          _id: "abc123",
          name: "Ondine",
          age: 12,
          region: "Kanto",
          badges: 4,
        },
        {
          _id: "abc2",
          name: "Pierre",
          age: 15,
          region: "Kanto",
          badges: 1,
        },
      ];

      (MockedTrainer.findById as jest.Mock).mockResolvedValue(fakeTrainers[0]);

      const res = await trainerService.getTrainerById("abc123");

      expect(MockedTrainer.findById).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("abc123");
      expect(res).toEqual(fakeTrainers[0]);
    });
  });

  // ====================================================
  // =================== GET TEAM =======================
  // ====================================================
  describe("getTrainerTeam", () => {
    test("should return null if trainer not found", async () => {
      (MockedTrainer.findById as jest.Mock).mockResolvedValue(null);
      const res = await trainerService.getTrainerById("fakeId");

      expect(MockedTrainer.findById).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("fakeId");
      expect(res).toBeFalsy();
    });

    test("should return object with trainer's name, array of pokemons, their count and averageLevel", async () => {
      const fakeTrainer = {
        _id: "abc123",
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };
      const fakePokemons = [
        {
          _id: "1",
          name: "Pikachu",
          type: "electrik",
          level: 15,
          trainerId: "abc123",
        },
        {
          _id: "2",
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: "abc123",
        },
      ];
      const fakeData = {
        trainer: "Ondine",
        count: 2,
        averageLevel: 26,
        pokemons: fakePokemons,
      };

      (MockedTrainer.findById as jest.Mock).mockResolvedValue(fakeTrainer);
      (MockedPokemon.find as jest.Mock).mockResolvedValue(fakePokemons);
      const res = await trainerService.getTrainerTeam("abc123");

      expect(MockedTrainer.findById).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("abc123");
      expect(MockedPokemon.find).toHaveBeenCalledWith({ trainerId: "abc123" });
      expect(res).toEqual(fakeData);
    });
    test("should return error if trainer ID is invalid", async () => {
      (MockedTrainer.findById as jest.Mock).mockResolvedValue(null);

      await expect(trainerService.getTrainerTeam("fakeId")).rejects.toThrow(
        "Dresseur non trouvé",
      );
      expect(MockedTrainer.findById).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findById).toHaveBeenCalledWith("fakeId");
      expect(MockedPokemon.find).not.toHaveBeenCalled();
    });
  });

  // ====================================================
  // =================== CREATE =========================
  // ====================================================

  describe("createTrainer", () => {
    test("should create a trainer in database", async () => {
      const trainerData: TTrainer = {
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };

      const savedTrainer = {
        _id: "abc",
        ...trainerData,
      };

      (MockedTrainer.create as jest.Mock).mockResolvedValue(savedTrainer);

      const res = await trainerService.createTrainer(trainerData);

      expect(MockedTrainer.create).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.create).toHaveBeenCalledWith(trainerData);
      expect(res).toMatchObject(trainerData);
    });
  });

  // ====================================================
  // =================== UPDATE =========================
  // ====================================================

  describe("updateTrainer", () => {
    test("should return null if trainer not found", async () => {
      const data = {
        age: 12,
      };
      (MockedTrainer.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const res = await trainerService.updateTrainer("fakeId", data);

      expect(MockedTrainer.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findByIdAndUpdate).toHaveBeenCalledWith(
        "fakeId",
        data,
        { returnDocument: "after" },
      );
      expect(res).toBeFalsy();
    });

    test("should return updated trainer", async () => {
      const data = {
        age: 12,
      };
      const updatedTrainer = {
        _id: "abc1",
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };

      (MockedTrainer.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedTrainer,
      );

      const res = await trainerService.updateTrainer("abc1", data);

      expect(MockedTrainer.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findByIdAndUpdate).toHaveBeenCalledWith(
        "abc1",
        data,
        { returnDocument: "after" },
      );
      expect(res?.age).toEqual(12);
    });
  });

  // ====================================================
  // =================== DELETE =========================
  // ====================================================

  describe("deleteTrainer", () => {
    test("should return null if trainer not found", async () => {
      (MockedTrainer.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      const res = await trainerService.deleteTrainer("fakeId");

      expect(MockedTrainer.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findByIdAndDelete).toHaveBeenCalledWith("fakeId");
      expect(res).toBeFalsy();
    });

    test("should return deleted trainer", async () => {
      const fakeTrainer = {
        _id: "abc1",
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };

      (MockedTrainer.findByIdAndDelete as jest.Mock).mockResolvedValue(
        fakeTrainer,
      );

      const res = await trainerService.deleteTrainer("abc1");

      expect(MockedTrainer.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(MockedTrainer.findByIdAndDelete).toHaveBeenCalledWith("abc1");
      expect(res).toEqual(fakeTrainer);
    });
    test("should return error if trainer has pokemons", async () => {
      const fakeTrainer = {
        _id: "t1",
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };

      const fakePokemon = {
        _id: "abc12",
        name: "Pikachu",
        type: "electrik",
        level: 15,
        trainerId: "t1",
      };

      (MockedTrainer.findByIdAndDelete as jest.Mock).mockResolvedValue(
        fakeTrainer,
      );
      (MockedPokemon.exists as jest.Mock).mockResolvedValue(true);

      await expect(trainerService.deleteTrainer("t1")).rejects.toThrow(
        "Impossible de supprimer un dresseur qui a des pokémons dans son équipe",
      );

      expect(MockedPokemon.exists).toHaveBeenCalledWith({ trainerId: "t1" });
      expect(MockedTrainer.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
