import { NextFunction, Request, Response } from "express";
import * as trainerService from "../services/trainerService";
import * as trainerController from "../controllers/trainerController";
import HttpError from "../utils/httpError";

jest.mock("../services/trainerService");
const mockedService = trainerService as jest.Mocked<typeof trainerService>;

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

describe("trainerController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTrainers", () => {
    test("should call res.json with array of trainers", async () => {
      mockedService.getAllTrainers.mockResolvedValue(fakeTrainers as any);

      const req = mockRequest();
      const res = mockResponse();

      await trainerController.getAllTrainers(req, res, mockNext);

      expect(mockedService.getAllTrainers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeTrainers);
    });

    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");
      mockedService.getAllTrainers.mockRejectedValue(error);

      const req = mockRequest();
      const res = mockResponse();
      await trainerController.getAllTrainers(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getTrainerById", () => {
    test("should return status 200 with the trainer", async () => {
      mockedService.getTrainerById.mockResolvedValue(fakeTrainers[0] as any);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await trainerController.getTrainerById(req as any, res, mockNext);

      expect(mockedService.getTrainerById).toHaveBeenCalledWith("abc12");
      expect(res.json).toHaveBeenCalledWith(fakeTrainers[0]);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return status 404 if trainer does not exist", async () => {
      mockedService.getTrainerById.mockResolvedValue(null);
      const req = mockRequest({ params: { id: "inexistant" } });
      const res = mockResponse();

      await trainerController.getTrainerById(req as any, res, mockNext);

      expect(mockedService.getTrainerById).toHaveBeenCalledWith("inexistant");
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Dresseur non trouvé",
          statusCode: 404,
        }),
      );
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe("getTrainerTeam", () => {
    test("should return status 200 with the trainer's team", async () => {
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

      mockedService.getTrainerTeam.mockResolvedValue(fakeData as any);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await trainerController.getTrainerTeam(req as any, res, mockNext);

      expect(mockedService.getTrainerTeam).toHaveBeenCalledWith("abc12");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeData);
    });

    test("should return status 404 if trainer does not exist", async () => {
      const error = new HttpError("Dresseur non trouvé", 404);
      mockedService.getTrainerTeam.mockRejectedValue(error);
      const req = mockRequest({ params: { id: "inexistant" } });
      const res = mockResponse();

      await trainerController.getTrainerTeam(req as any, res, mockNext);

      expect(mockedService.getTrainerTeam).toHaveBeenCalledWith("inexistant");
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Dresseur non trouvé",
          statusCode: 404,
        }),
      );
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("createTrainer", () => {
    const fakeData = {
      name: "Ondine",
      age: 12,
      region: "Kanto",
      badges: 4,
    };
    test("should return status 201 with created trainer", async () => {
      mockedService.createTrainer.mockResolvedValue(fakeData as any);
      const req = mockRequest({ body: fakeData });
      const res = mockResponse();

      await trainerController.createTrainer(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockedService.createTrainer).toHaveBeenCalledWith(fakeData);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Ondine" }),
      );
    });
    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");
      mockedService.createTrainer.mockRejectedValue(error);

      const req = mockRequest({ body: fakeData });

      const res = mockResponse();
      await trainerController.createTrainer(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateTrainer", () => {
    const fakeData = {
      age: 25,
    };
    test("should return status 200 with updated trainer", async () => {
      const updatedTrainer = {
        _id: "abc12",
        name: "Ondine",
        age: 25,
        region: "Kanto",
        badges: 4,
      };
      mockedService.updateTrainer.mockResolvedValue(updatedTrainer as any);
      const req = mockRequest({ params: { id: "abc12" }, body: fakeData });
      const res = mockResponse();

      await trainerController.updateTrainer(req as any, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTrainer);
    });

    test("should return status 404 if trainer does not exist", async () => {
      mockedService.updateTrainer.mockResolvedValue(null);
      const req = mockRequest({
        params: { id: "ineexistant" },
        body: fakeData,
      });
      const res = mockResponse();

      await trainerController.updateTrainer(req as any, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Dresseur non trouvé",
          statusCode: 404,
        }),
      );
    });
  });

  describe("deleteTrainer", () => {
    test("should return status 204 if trainer was deleted", async () => {
      mockedService.deleteTrainer.mockResolvedValue(fakeTrainers[0] as any);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await trainerController.deleteTrainer(req as any, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    test("should return status 404 if trainer does not exist", async () => {
      mockedService.deleteTrainer.mockResolvedValue(null);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();

      await trainerController.deleteTrainer(req as any, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Dresseur non trouvé",
          statusCode: 404,
        }),
      );
    });
    test("should call next(err) if error was thrown", async () => {
      const error = new Error("DB Error");

      mockedService.deleteTrainer.mockRejectedValue(error);
      const req = mockRequest({ params: { id: "abc12" } });
      const res = mockResponse();
      await trainerController.deleteTrainer(req as any, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
