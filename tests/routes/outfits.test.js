const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");
const Outfit = require("../../src/schemas/Outfit");
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
describe("POST /api/outfits/upload", () => {
  describe("Request Validation Section", () => {
    test("should return 400 if wrong media type", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "application/json") // intentionally setting the wrong media type
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if no file provided", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit")
        .field("Description", "Test Description")
        .field("Price", 100);
      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if missing Name field", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Description", "Test Description")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(400);
    });

    test("should return 400 if missing Price field", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit")
        .field("Description", "Test Description")
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 403 if the user do not have permission", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_User)
        .field("Name", "Test Outfit")
        .field("Description", "Test Description")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(401);
    });

    test("should return 401 if the provided token is invalid", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + "SomeRandomToken")
        .field("Name", "Test Outfit")
        .field("Description", "Test Description")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Controller Sections", () => {
    test("should return 201 if everything is correct", async () => {
      const response = await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit 1")
        .field("Description", "Test Description 1")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      expect(response.statusCode).toBe(201);
      // add some more outfits if the test is passed for other tests
      await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit 2")
        .field("Description", "Test Description 2")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit 3")
        .field("Description", "Test Description 3")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");

      await server
        .post("/api/outfits/upload")
        .set("media-type", "multipart/form-data")
        .set("Authorization", "Bearer " + AuthToken_Admin)
        .field("Name", "Test Outfit 4")
        .field("Description", "Test Description 4")
        .field("Price", 100)
        .attach("file", "./tests/assets/test_dummy.png");
    });
  });
});

describe("GET /api/outfits", () => {
  describe("Request Validation Section", () => {
    test("No Validation for this endpoint", () => {
      expect(true).toBe(true);
    });
  });

  describe("Authorization section", () => {
    test("should return 200 for user", async () => {
      const response = await server
        .get("/api/outfits")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
    });

    test("should return 200 for user", async () => {
      const response = await server
        .get("/api/outfits")
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("Controller section", () => {
    test("should return 201 for user", async () => {
      const outfits = await Outfit.find();

      const response = await server
        .get("/api/outfits")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0].Name).toBe(outfits[0].Name);
    });
  });
});

describe("GET /api/outfits/:id", () => {
  describe("Validation section", () => {
    test("should return 400 if the id is not a valid ObjectId", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .get("/api/outfits/1234")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 200 for user", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .get("/api/outfits/" + outfitId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
    });

    test("should return 200 for user", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .get("/api/outfits/" + outfitId)
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("Controller section", () => {
    test("should return 200 correct request", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .get("/api/outfits/" + outfitId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(200);
      expect(response.body.Name).toBe(outfits[0].Name);
      expect(response.body.Description).toBe(outfits[0].Description);
      expect(response.body.Price).toBe(outfits[0].Price);
    });
  });
});

describe("DELETE /api/outfits/delete/:id", () => {
  describe("Validation section", () => {
    test("should return 400 if the id is not a valid ObjectId", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .delete("/api/outfits/delete/1234")
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("Authorization section", () => {
    test("should return 401 for user", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .delete("/api/outfits/delete/" + outfitId)
        .set("Authorization", "Bearer " + AuthToken_User);

      expect(response.statusCode).toBe(401);
    });
  });

  describe("Controller section", () => {
    test("should return 200 correct request", async () => {
      const outfits = await Outfit.find();
      const outfitId = outfits[0]._id;
      const response = await server
        .delete("/api/outfits/delete/" + outfitId)
        .set("Authorization", "Bearer " + AuthToken_Admin);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Success");
      const outfit = await Outfit.findOne({ _id: outfitId });
      expect(outfit).toBe(null);
    });
  });
});
