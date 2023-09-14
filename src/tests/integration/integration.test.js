const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../../app");

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
    console.log("Connected to test MongoDB");
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

describe("Documentation end point", () => {
  test("It should return the documentation", async () => {
    const response = await server.get("/api/documentation/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Create a new user", () => {
  test("Check with not existing user ", async () => {
    const response = await server
      .post("/api/users/checkUser")
      .send({ Email: "SomeRandomEmail@Email.com" });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("User is not valid");
  });

  test("Check with existing Tanda user but not registered", async () => {
    const response = await server
      .post("/api/users/checkUser")
      .send({ Email: "demoaccount+199087@tanda.co" });
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "User is valid and exist in Tanda DB but not registered"
    );
  });

  test("Register a new user", async () => {
    const response = await server
      .post("/api/users/register")
      .send({ Email: "demoaccount+199087@tanda.co", Password: "LetsTanda123" });

    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe("Success");
  });

  test("Register an existing user", async () => {
    const response = await server
      .post("/api/users/register")
      .send({ Email: "demoaccount+199087@tanda.co", Password: "LetsTanda123" });
    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("User already exists!");
  });

  test("Login with correct credentials", async () => {
    const response = await server
      .post("/api/users/login")
      .send({ Email: "demoaccount+199087@tanda.co", Password: "LetsTanda123" });
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body).toHaveProperty("token");
    AuthToken = response.body.token;
  });
});
