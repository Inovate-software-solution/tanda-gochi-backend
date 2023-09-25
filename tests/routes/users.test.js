const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");

require("dotenv").config();

const mongod = new MongoMemoryServer();
let server;
let AuthToken;
let DeviceToken;

beforeAll(async () => {
  await mongod.start();
  process.env.DB_CONNECTION_STRING = await mongod.getUri();

  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      dbName: "tanda",
    });
  } catch (error) {
    console.error("Could not connect to test MongoDB", error);
    process.exit(1); // Exit the process with failure code
  }

  server = request(app);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
});

describe("POST /api/users/register", () => {
  describe("Test for poor request body", () => {
    test("Should return 400 if the request body is empty", async () => {
      const response = await server.post("/api/users/register").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the request body is missing Email", async () => {
      const response = await server
        .post("/api/users/register")
        .send({ Password: "SomePassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the request body is missing Password", async () => {
      const response = await server
        .post("/api/users/register")
        .send({ Email: "Test@test.com" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the Email is invalid email format", async () => {
      const response = await server
        .post("/api/users/register")
        .send({ Email: "SomeRandomString", Password: "SomePassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });
  });

  describe("Test for the response", () => {
    test("Should return 404 if the user is invalid", async () => {
      const response = await server.post("/api/users/register").send({
        Email: "SomeRandomEmail@Random.com",
        Password: "SomePassword",
      });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
    });

    test("Register the user if the user is valid in Tanda DB", async () => {
      const response = await server.post("/api/users/register").send({
        Email: process.env.TANDA_ACCOUNT_EMAIL,
        Password: process.env.TANDA_ACCOUNT_PASSWORD,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe("Success");
    });
  });
});

describe("POST /api/users/checkUser", () => {
  describe("Test for poor request body", () => {
    test("Should return 400 if the request body is empty", async () => {
      const response = await server.post("/api/users/checkUser").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the Email format is invalid", async () => {
      const response = await server.post("/api/users/checkUser").send({
        Email: "TotallyNotValidEmail",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });
  });

  describe("Test for the response", () => {
    test("Should return 404 if the user is invalid", async () => {
      const response = await server
        .post("/api/users/checkUser")
        .send({ Email: "SomeRandomEmail@Random.com" });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("User is not valid");
    });

    test("Should return 404 if the user is valid but not registered", async () => {
      const test_email = "demo_account_user199087+0@tanda.co";
      const response = await server
        .post("/api/users/checkUser")
        .send({ Email: test_email });
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe(
        "User is valid and exist in Tanda DB but not registered"
      );
    });

    test("Should return 200 if the user is exist and registered", async () => {
      const response = await server
        .post("/api/users/checkUser")
        .send({ Email: process.env.TANDA_ACCOUNT_EMAIL });
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe("User exists and registered");
    });
  });
});

describe("POST /api/users/login", () => {
  describe("Test for poor request body", () => {
    test("Should return 400 if the request body is empty", async () => {
      const response = await server.post("/api/users/login").send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the request body is missing Email", async () => {
      const response = await server
        .post("/api/users/login")
        .send({ Password: "SomePassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the request body is missing Password", async () => {
      const response = await server
        .post("/api/users/login")
        .send({ Email: "SomeRandomEmail@Random.com" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    test("Should return 400 if the Email is invalid format", async () => {
      const response = await server.post("/api/users/login").send({
        Email: "InvalidEmail",
        Password: "APassword",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });
  });

  describe("Test for the response", () => {
    test("Should return 401 if the user is invalid", async () => {
      const response = await server.post("/api/users/login").send({
        Email: "SomeRandomEmail@RandomEmail.com",
        Password: "AAAAAAAAAA",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe(true);
    });

    test("Should return 401 if wrong password", async () => {
      const response = await server.post("/api/users/login").send({
        Email: process.env.TANDA_ACCOUNT_EMAIL,
        Password: "WrongPassword",
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe(true);
    });

    test("Should return 200 on successful login and return a token", async () => {
      const response = await server.post("/api/users/login").send({
        Email: process.env.TANDA_ACCOUNT_EMAIL,
        Password: process.env.TANDA_ACCOUNT_PASSWORD,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body).toHaveProperty("token");
      AuthToken = response.body.token;
    });
  });
});
