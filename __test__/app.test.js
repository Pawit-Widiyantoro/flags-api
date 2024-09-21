import request from "supertest";
import app from "../app";
import connection from "../config/db";
import { Country } from "../models";

describe("Country API", () => {

    beforeEach(async () => {
        // Truncate the table (removes all existing data)
        await Country.destroy({ truncate: true });

        // Insert data before each test
        await Country.bulkCreate([
            { name: 'USA', code: 'USA', region: 'North America' },
            { name: 'Canada', code: 'CAN', region: 'North America' },
            { name: 'Mexico', code: 'MEX', region: 'North America' },
            { name: 'Brazil', code: 'BRA', region: 'South America' },
            { name: 'Argentina', code: 'ARG', region: 'South America' }
        ]);
    });

    afterAll(async () => {
        // Close the database connection after all tests are done
        await connection.close();
    });

    describe("GET /api/countries", () => {
        it("Should return all countries", async () => {
            const response = await request(app).get("/api/countries/");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBe(5);  // 5 countries inserted
        });

        it("Should return 400 for invalid page or limit parameters", async () => {
            const response = await request(app).get("/api/countries?page=-1&limit=abc");
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("message", "Invalid page or limit numbers");
        });

        it("Should return 404 if no countries are found", async () => {
            // Clean the table for this test
            await Country.destroy({ truncate: true });

            const response = await request(app).get("/api/countries/");
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty("message", "Country data is empty!");
        });
    });

    describe("GET /api/countries/:code", () => {
        it("Should return a country by code", async () => {
            const response = await request(app).get("/api/countries/USA");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data.code).toBe("USA");
        });

        it("Should return 404 for a non-existent country", async () => {
            const response = await request(app).get("/api/countries/XYZ");
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty("message", "country not found");
        });
    });

    describe("GET /api/countries/search", () => {
        it("Should return countries filtered by name or code", async () => {
            const response = await request(app).get("/api/countries/search?name=Canada");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data[0].name).toBe("Canada");
        });

        it("should return 400 if no search query is provided", async () => {
            const response = await request(app).get("/api/countries/search");
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("message", "Please provide a search query (code or name)!");
        });

        it("should return 404 if no countries match the search", async () => {
            const response = await request(app).get("/api/countries/search?name=ZZZ");
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty("message", "No countries found matching the keyword");
        });
    });

    describe("GET /api/countries/region/:region", () => {
        it("should return countries from the specified region", async () => {
            const response = await request(app).get("/api/countries/region/South America");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data.length).toBeGreaterThan(0);  // at least 2 countries in South America
        });

        it("should return 404 if no countries are found in the region", async () => {
            const response = await request(app).get("/api/countries/region/UnknownRegion");
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty("message", "No countries found in the region: UnknownRegion");
        });
    });
});
