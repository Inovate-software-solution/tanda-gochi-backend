const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");
const Badge = require("../../src/schemas/Badge");
const path = require("path");
require("dotenv").config();

// const fs = require("fs");

// console.log(__dirname);
// const dummyTestImage = path.join(__dirname, "../assets/test_dummy.png");

// let fileBuffer;

const mongod = new MongoMemoryServer();
let server;

let AuthToken_Admin;
let AuthToken_User;

let DeviceToken;

beforeAll(async () => {
  await mongod.start();
  process.env.DB_CONNECTION_STRING = await mongod.getUri();

  try {
    // fileBuffer = fs.readFileSync(dummyTestImage);
    // console.log("Read file:", fileBuffer);
  } catch (err) {
    console.error("An error occurred while reading the file:", err);
  }

  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      dbName: "tanda",
    });
  } catch (error) {
    console.error("Could not connect to test MongoDB", error);
    process.exit(1); // Exit the process with failure code
  }

  server = request(app);

  await server.post("/api/users/register").send({
    Email: process.env.TANDA_ACCOUNT_EMAIL,
    Password: process.env.TANDA_ACCOUNT_PASSWORD,
  });

  const response = await server.post("/api/users/login").send({
    Email: process.env.TANDA_ACCOUNT_EMAIL,
    Password: process.env.TANDA_ACCOUNT_PASSWORD,
  });

  AuthToken_Admin = response.body.token;

  await server.post("/api/users/register").send({
    Email: process.env.TANDA_ACCOUNT_EMAIL_USER,
    Password: process.env.TANDA_ACCOUNT_PASSWORD_USER,
  });

  const response2 = await server.post("/api/users/login").send({
    Email: process.env.TANDA_ACCOUNT_EMAIL_USER,
    Password: process.env.TANDA_ACCOUNT_PASSWORD_USER,
  });
  AuthToken_User = response2.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
});

// ###############################################
// ###############################################
// ###############################################
describe("POST /api/badges/upload", () => {
  describe("Request Validation Section", () => {
    test("should return 400 if wrong media type", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "application/json") // intentionally setting the wrong media type
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if no file provided", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Title", "Test Badge")
        .field("Description", "Test Description");
      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if missing Title field", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Description", "Test Description")
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 403 if the user do not have permission", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_User)
        .field("Title", "Test Badge")
        .field("Description", "Test Description")
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(401);
    });

    test("should return 401 if the provided token is invalid", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + "SomeRandomToken")
        .field("Title", "Test Badge")
        .field("Description", "Test Description")
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Controller Sections", () => {
    test("should return 201 if everything is correct", async () => {
      const response = await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Title", "Test Badge 1")
        .field("Description", "Test Description 1")
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(201);
      // add some more badges if the test is passed for other tests
      await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Title", "Test Badge 2")
        .field("Description", "Test Description 2")
        .attach("file", "./tests/assets/test_dummy.png");

      await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Title", "Test Badge 3")
        .field("Description", "Test Description 3")
        .attach("file", "./tests/assets/test_dummy.png");

      await server
        .post("/api/badges/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Title", "Test Badge 4")
        .field("Description", "Test Description 4")
        .attach("file", "./tests/assets/test_dummy.png");
    });
  });
});

describe("GET /api/badges", () => {
  describe("Request Validation Section", () => {
    test("No Validation for this endpoint", () => {
      expect(true).toBe(true);
    });
  });

  describe("Authorization section", () => {
    test("should return 200 for user", async () => {
      const response = await server
        .get("/api/badges")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
    });

    test("should return 200 for user", async () => {
      const response = await server
        .get("/api/badges")
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("Controller section", () => {
    test("should return 201 for user", async () => {
      const badges = await Badge.find();

      const response = await server
        .get("/api/badges")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].Title).toBe(badges[0].Title);
    });
  });
});

describe("GET /api/badges/:id", () => {
  describe("Validation section", () => {
    test("should return 400 if the id is not a valid ObjectId", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .get("/api/badges/1234")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 200 for user", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .get("/api/badges/" + badgeId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
    });

    test("should return 200 for user", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .get("/api/badges/" + badgeId)
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("Controller section", () => {
    test("should return 200 correct request", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .get("/api/badges/" + badgeId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
      expect(response.body.Title).toBe(badges[0].Title);
      expect(response.body.Description).toBe(badges[0].Description);
    });
  });
});

describe("DELETE /api/badges/delete/:id", () => {
  describe("Validation section", () => {
    test("should return 400 if the id is not a valid ObjectId", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .delete("/api/badges/delete/1234")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 401 for Toyuser", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .delete("/api/badges/delete/" + badgeId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Controller section", () => {
    test("should return 200 correct request", async () => {
      const badges = await Badge.find();
      const badgeId = badges[0]._id;
      const response = await server
        .delete("/api/badges/delete/" + badgeId)
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Success");
      const badge = await Badge.findOne({ _id: badgeId });
      expect(badge).toBe(null);
    });
  });
});
