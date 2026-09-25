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

const createTrainer = async (): Promise<string> => {
  const response = await request(app)
    .post("/api/trainers")
    .send(fakeTrainers[0]);
  return response.body._id;
};

const fakePokemons = [
  {
    name: "Pikachu",
    type: "electrik",
    level: 15,
    trainerId: null,
  },
  {
    name: "Raichu",
    type: "plante",
    level: 36,
    trainerId: null,
  },
];

const createPokemons = async (): Promise<void> => {
  for (const p of fakePokemons) {
    await request(app).post("/api/pokemons").send(p);
  }
};

describe("Routes /api/pokemons", () => {
  // ============================================================
  // POST /api/pokemons
  // ============================================================
  describe("POST /api/pokemons", () => {
    test("should create a pokemon and return status 201 with pokemon's data", async () => {
      const pokemonData = {
        name: "Raichu",
        type: "electrik",
        level: 36,
        trainerId: null,
      };
      const response = await request(app)
        .post("/api/pokemons")
        .send(pokemonData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(pokemonData);
      expect(response.body._id).toBeDefined();
    });
    test("should return an error if name was not provided", async () => {
      const pokemonData = {
        type: "electrik",
        level: 36,
        trainerId: null,
      };
      const response = await request(app)
        .post("/api/pokemons")
        .send(pokemonData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(400);
    });
    test("should return an error (404) if trainer ID is invalid", async () => {
      const pokemonData = {
        name: "Raichu",
        type: "electrik",
        level: 36,
        trainerId: fakeId,
      };
      const response = await request(app)
        .post("/api/pokemons")
        .send(pokemonData)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
    test("should return an error (409) if trainer has too many pokemons", async () => {
      const id = await createTrainer();
      const fakePokemon = {
        name: "Raichu",
        type: "electrik",
        level: 36,
        trainerId: id,
      };

      for (let i = 0; i < 6; i++) {
        await request(app)
          .post("/api/pokemons")
          .send(fakePokemon)
          .set("Accept", "application/json");
      }

      const response = await request(app)
        .post("/api/pokemons")
        .send(fakePokemon)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(409);
    });
  });

  // ============================================================
  // GET /api/pokemons
  // ============================================================
  describe("GET /api/pokemons", () => {
    test("should return empty array", async () => {
      const response = await request(app)
        .get("/api/pokemons")
        .set("Accept", "application/json");

      expect(response.body).toEqual([]);
    });
    test("should return array of pokemons", async () => {
      await createPokemons();

      const response = await request(app)
        .get("/api/pokemons")
        .set("Accept", "application/json");

      expect(response.body).toMatchObject(fakePokemons);
      expect(response.body).toHaveLength(2);
    });
    test("should return array of pokemons of specific type", async () => {
      await createPokemons();

      const response = await request(app)
        .get("/api/pokemons?type=plante")
        .set("Accept", "application/json");

      expect(response.body).toMatchObject([fakePokemons[1]]);
      expect(response.body).toHaveLength(1);
    });
  });

  // ============================================================
  // GET /api/pokemons/:id
  // ============================================================
  describe("GET /api/pokemons/:id", () => {
    test("should return a pokemon of a specific ID", async () => {
      await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[0])
        .set("Accept", "application/json");
      const pokemon = await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[1])
        .set("Accept", "application/json");

      const id = pokemon.body._id;

      const response = await request(app)
        .get(`/api/pokemons/${id}`)
        .set("Accept", "application/json");

      expect(response.body).toMatchObject(pokemon.body);
      expect(response.body.name).toBe("Raichu");
    });
    test("should return status 404 for unexisting ID", async () => {
      const response = await request(app)
        .get(`/api/pokemons/${fakeId}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================================
  // PUT /api/pokemons/:id
  // ============================================================
  describe("PUT /api/pokemons/:id", () => {
    test("should return updated pokemon", async () => {
      const pokemon = await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[0])
        .set("Accept", "application/json");

      const id = pokemon.body._id;

      const response = await request(app)
        .put(`/api/pokemons/${id}`)
        .send({ name: "Bulbasaur" })
        .set("Accept", "application/json");

      expect(response.body.name).toMatch(/Bulbasaur/);
    });
    test("should return status 404 for not found pokemon", async () => {
      const response = await request(app)
        .put(`/api/pokemons/${fakeId}`)
        .send({ name: "Bulbasaur" })
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });

  // ============================================================
  // DELETE /api/pokemons/:id
  // ============================================================
  describe("DELETE /api/pokemons/:id", () => {
    test("should return status 204 after pokemon deletion", async () => {
      const pokemon = await request(app)
        .post("/api/pokemons")
        .send(fakePokemons[0])
        .set("Accept", "application/json");

      const id = pokemon.body._id;

      const response = await request(app)
        .delete(`/api/pokemons/${id}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(204);
    });

    test("should return status 404 for not found pokemon", async () => {
      const response = await request(app)
        .delete(`/api/pokemons/${fakeId}`)
        .set("Accept", "application/json");

      expect(response.statusCode).toBe(404);
    });
  });
});
