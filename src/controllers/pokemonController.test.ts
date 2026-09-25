import { NextFunction, Request, Response } from "express";
import * as pokemonService from "../services/pokemonService";
import * as pokemonController from "../controllers/pokemonController";
import { createHttpError } from "../utils/httpError";

jest.mock("../services/pokemonService");
const mockedService = pokemonService as jest.Mocked<typeof pokemonService>;

const mockRequest = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    body: {},
    query: {},
    ...overrides,
  } as Request;
};
const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};
const mockNext: NextFunction = jest.fn();

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

describe("pokemonController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPokemons", () => {
    test("should call res.json with array of pokemons", async () => {
      mockedService.getAllPokemons.mockResolvedValue(fakePokemons as any);

      const req = mockRequest();
      const res = mockResponse();

      await pokemonController.getAllPokemons(req, res, mockNext);

      expect(mockedService.getAllPokemons).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakePokemons);
    });

    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");
      mockedService.getAllPokemons.mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();
      await pokemonController.getAllPokemons(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getPokemonById", () => {
    test("should return status 200 with the pokemon", async () => {
      mockedService.getPokemonById.mockResolvedValue(fakePokemons[0] as any);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await pokemonController.getPokemonById(req as any, res, mockNext);

      expect(mockedService.getPokemonById).toHaveBeenCalledWith("abc12");
      expect(res.json).toHaveBeenCalledWith(fakePokemons[0]);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return status 404 if pokemon does not exist", async () => {
      mockedService.getPokemonById.mockResolvedValue(null);
      const req = mockRequest({ params: { id: "inexistant" } });
      const res = mockResponse();

      await pokemonController.getPokemonById(req as any, res, mockNext);

      expect(mockedService.getPokemonById).toHaveBeenCalledWith("inexistant");
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Pokémon non trouvé",
          statusCode: 404,
        }),
      );
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("createPokemon", () => {
    const fakeData = {
      name: "Pikachu",
      type: "electrik",
      level: 15,
      trainerId: null,
    };

    test("should return status 201 with created pokemon", async () => {
      mockedService.createPokemon.mockResolvedValue(fakeData as any);
      const req = mockRequest({ body: fakeData });
      const res = mockResponse();

      await pokemonController.createPokemon(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockedService.createPokemon).toHaveBeenCalledWith(fakeData);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Pikachu" }),
      );
    });
    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");
      mockedService.createPokemon.mockRejectedValue(error);

      const req = mockRequest({ body: fakeData });

      const res = mockResponse();
      await pokemonController.createPokemon(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
    test("should return status 404 if invalid trainerId was passed", async () => {
      const error = createHttpError(
        404,
        "Le dresseur correspondant à cet ID n'existe pas",
      );
      mockedService.createPokemon.mockRejectedValue(error);

      const req = mockRequest({ body: fakeData });

      const res = mockResponse();
      await pokemonController.createPokemon(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
    test("should return status 409 if trainer has too many pokemons in team", async () => {
      const error = createHttpError(
        409,
        "Un dresseur peut avoir un maximum de 6 pokémons. Limite atteinte.",
      );
      mockedService.createPokemon.mockRejectedValue(error);

      const req = mockRequest({ body: fakeData });

      const res = mockResponse();
      await pokemonController.createPokemon(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updatePokemon", () => {
    const fakeData = {
      type: "plante",
    };

    const updatedPokemon = {
      _id: "abc12",
      name: "Pikachu",
      type: "plante",
      level: 15,
      trainerId: "t1",
    };
    test("should return status 200 with updated pokemon", async () => {
      mockedService.updatePokemon.mockResolvedValue(updatedPokemon as any);
      const req = mockRequest({ params: { id: "abc12" }, body: fakeData });
      const res = mockResponse();

      await pokemonController.updatePokemon(req as any, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPokemon);
    });

    test("should return status 404 if pokemon does not exist", async () => {
      mockedService.updatePokemon.mockResolvedValue(null);
      const req = mockRequest({ params: { id: "inexistant" }, body: fakeData });
      const res = mockResponse();

      await pokemonController.updatePokemon(req as any, res, mockNext);

      expect(mockedService.updatePokemon).toHaveBeenCalledWith(
        "inexistant",
        fakeData,
      );
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Pokémon non trouvé",
          statusCode: 404,
        }),
      );
    });
  });

  describe("deletePokemon", () => {
    test("should return status 204 if pokemon was deleted", async () => {
      mockedService.deletePokemon.mockResolvedValue(fakePokemons[0] as any);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await pokemonController.deletePokemon(req as any, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    test("should return status 404 if trainer does not exist", async () => {
      mockedService.deletePokemon.mockResolvedValue(null);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await pokemonController.deletePokemon(req as any, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Pokémon non trouvé",
          statusCode: 404,
        }),
      );
    });
    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");

      mockedService.deletePokemon.mockRejectedValue(error);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();
      await pokemonController.deletePokemon(req as any, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
