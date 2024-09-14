import request from "supertest";
import app from "../app";
import connection from "../config/db";

beforeAll(async () => {
    try {
        await connection.sync({ alter: true });
        console.log("Database synchronized!");
    } catch (error) {
        console.error("Error synchronizing database ", error);
    }
});

afterAll(async () => {
    await connection.close(); // Ensure the database connection is closed after tests
});

describe("Country API", () => {
    it("should return all countries", async () => {
        const response = await request(app).get("/api/countries/");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it("should return a country by code", async () => {
        const response = await request(app).get("/api/countries/USA");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body.data.code).toBe("USA");
    });

    it("should return 404 for a non-existent country", async () => {
        const response = await request(app).get("/api/countries/XYZ");
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message", "country not found");
    });
});