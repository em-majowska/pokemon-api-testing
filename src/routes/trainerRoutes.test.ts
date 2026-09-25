import request from "supertest";
import mongoose from "mongoose";
import app from "../server";

const fakeId = new mongoose.Types.ObjectId();
const fakeTrainers = [
  {
    name: "Ondine",
    age: 12,
    region: "Kanto",
    badges: 4,
  },
  {
    name: "Pierre",
    age: 15,
    region: "Kanto",
    badges: 1,
  },
];

describe("Routes /api/trainers", () => {
  // ============================================================
  // POST /api/trainers
  // ============================================================
  describe("POST /api/trainers", () => {
    test("should create a trainer and return status 201 with trainer's data", async () => {
      const trainerData = {
        name: "Ondine",
        age: 12,
        region: "Kanto",
        badges: 4,
      };
      const response = await request(app)
        .post("/api/trainers")
        .send(trainerData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(trainerData);
      expect(response.body._id).toBeDefined();
    });
    test("should return an error if name was not provided", async () => {
      const trainerData = {
        age: 12,
        region: "Kanto",
        badges: 4,
      };
      const response = await request(app)
        .post("/api/trainers")
        .send(trainerData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400);
    });
  });

  // ============================================================
  // GET /api/trainers
  // ============================================================
  describe("GET /api/trainers", () => {
    test("should return empty array", async () => {
      const response = await request(app)
        .get("/api/trainers")
        .set("Accept", "application/json");

      expect(response.body).toEqual([]);
    });
    test("should return array of trainers", async () => {
      await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");
      await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[1])
        .set("Accept", "application/json");

      const response = await request(app)
        .get("/api/trainers")
        .set("Accept", "application/json");

      expect(response.body).toMatchObject(fakeTrainers);
      expect(response.body).toHaveLength(2);
    });
  });

  // ============================================================
  // GET /api/trainers/:id
  // ============================================================
  describe("GET /api/trainers/:id", () => {
    test("should return a trainer of a specific ID", async () => {
      await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");
      const trainer = await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[1])
        .set("Accept", "application/json");

      const id = trainer.body._id;

      const response = await request(app)
        .get(`/api/trainers/${id}`)
        .set("Accept", "application/json");

      expect(response.body).toMatchObject(fakeTrainers[1]!);
      expect(response.body.name).toBe("Pierre");
    });
    test("should return status 404 for unexisting ID", async () => {
      const response = await request(app)
        .get(`/api/trainers/${fakeId}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================================
  // GET /api/trainers/:id/pokemons
  // ============================================================
  describe("GET /api/trainers/:id/pokemons", () => {
    test("should return a team of a specific trainer", async () => {
      await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");
      const trainer = await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[1])
        .set("Accept", "application/json");

      const id = trainer.body._id;

      const fakePokemons = [
        {
          name: "Pikachu",
          type: "electrik",
          level: 15,
          trainerId: id,
        },
        {
          name: "Raichu",
          type: "electrik",
          level: 36,
          trainerId: id,
        },
      ];

      const fakeData = {
        trainer: "Pierre",
        count: 2,
        averageLevel: 26,
        pokemons: fakePokemons,
      };

      await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[0])
        .set("Accept", "application/json");
      await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[1])
        .set("Accept", "application/json");

      const response = await request(app)
        .get(`/api/trainers/${id}/pokemons`)
        .set("Accept", "application/json");

      expect(response.body).toMatchObject(fakeData);
    });

    test("should return status 404 for unexisting ID", async () => {
      const response = await request(app)
        .get(`/api/trainers/${fakeId}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================================
  // PUT /api/trainers/:id
  // ============================================================
  describe("PUT /api/trainers/:id", () => {
    test("should return updated trainer", async () => {
      const trainer = await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");

      const id = trainer.body._id;

      const response = await request(app)
        .put(`/api/trainers/${id}`)
        .send({ age: 24 })
        .set("Accept", "application/json");

      expect(response.body.age).toBe(24);
    });
    test("should return status 404 for not found trainer", async () => {
      const response = await request(app)
        .put(`/api/trainers/${fakeId}`)
        .send({ age: 24 })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================================
  // DELETE /api/trainers/:id
  // ============================================================
  describe("DELETE /api/trainers/:id", () => {
    test("should return status 204 after trainer deletion", async () => {
      const trainer = await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");

      const id = trainer.body._id;

      const response = await request(app)
        .delete(`/api/trainers/${id}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(204);
    });

    test("should return status 409 if trainer has pokemon on his team", async () => {
      const trainer = await request(app)
        .post("/api/trainers")
        .send(fakeTrainers[0])
        .set("Accept", "application/json");

      const id = trainer.body._id;

      await request(app)
        .post("/api/pokemons")
        .send({
          name: "Pikachu",
          type: "electrik",
          level: 15,
          trainerId: id,
        })
        .set("Accept", "application/json");

      const response = await request(app)
        .delete(`/api/trainers/${id}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(409);
    });

    test("should return status 404 for not found trainer", async () => {
      const response = await request(app)
        .delete(`/api/trainers/${fakeId}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });
});
