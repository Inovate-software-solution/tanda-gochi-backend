const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");

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

describe("Upload new Badges", () => {
  test("should return 201 if everything is correct", async () => {
    const response = await server
      .post("/api/badges/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Title", "Test Badge 1")
      .field("Description", "Test Description 1")
      .attach("file", "./tests/assets/test_dummy.png");

    expect(response.statusCode).toBe(201);
    // add some more badges if the test is passed for other tests
    await server
      .post("/api/badges/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Title", "Test Badge 2")
      .field("Description", "Test Description 2")
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/badges/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Title", "Test Badge 3")
      .field("Description", "Test Description 3")
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/badges/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Title", "Test Badge 4")
      .field("Description", "Test Description 4")
      .attach("file", "./tests/assets/test_dummy.png");
  });
});

describe("Upload new Items", () => {
  test("should return 201 if everything is correct", async () => {
    const response = await server
      .post("/api/items/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Item 1")
      .field("Description", "Test Description 1")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    expect(response.statusCode).toBe(201);
    // add some more items if the test is passed for other tests
    await server
      .post("/api/items/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Item 2")
      .field("Description", "Test Description 2")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/items/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Item 3")
      .field("Description", "Test Description 3")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/items/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Item 4")
      .field("Description", "Test Description 4")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");
  });
});

describe("Upload new Toys", () => {
  test("should return 201 if everything is correct", async () => {
    const response = await server
      .post("/api/toys/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Toy 1")
      .field("Description", "Test Description 1")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    expect(response.statusCode).toBe(201);
    // add some more toys if the test is passed for other tests
    await server
      .post("/api/toys/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Toy 2")
      .field("Description", "Test Description 2")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/toys/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Toy 3")
      .field("Description", "Test Description 3")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/toys/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Toy 4")
      .field("Description", "Test Description 4")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");
  });
});

describe("Upload new Outfits", () => {
  test("should return 201 if everything is correct", async () => {
    const response = await server
      .post("/api/outfits/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Outfit 1")
      .field("Description", "Test Description 1")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    expect(response.statusCode).toBe(201);
    // add some more outfits if the test is passed for other tests
    await server
      .post("/api/outfits/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Outfit 2")
      .field("Description", "Test Description 2")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/outfits/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Outfit 3")
      .field("Description", "Test Description 3")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");

    await server
      .post("/api/outfits/upload")
      .set("media-type", "multipart/form-data")
      .set("Authorization", "Bearer " + AuthToken)
      .field("Name", "Test Outfit 4")
      .field("Description", "Test Description 4")
      .field("Price", 100)
      .attach("file", "./tests/assets/test_dummy.png");
  });
});

describe("Buy something without credit", () => {
  test("should return 403 if having no credits for toys", async () => {
    const ToyId = await server
      .get("/api/toys")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/toy")
      .send({ ToyId: ToyId })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(403);
  });

  test("should return 403 if having no credits for oufits", async () => {
    const OutfitId = await server
      .get("/api/outfits")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/outfit")
      .send({ OutfitId: OutfitId })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(403);
  });

  test("should return 403 if having no credits for items", async () => {
    const ItemId = await server
      .get("/api/items")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/item")
      .send({ ItemId: ItemId, Quantity: 3 })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(403);
  });
});

describe("Add credits", () => {
  test("should return 200 if everything is correct", async () => {
    const TargetUserId = await server
      .get("/api/users")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/users/addcredits")
      .send({ TargetUserId: TargetUserId, Credits: 1000 })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(200);
  });
});

describe("Buy toys with credit", () => {
  test("should return 200 if everything is correct", async () => {
    const ToyId = await server
      .get("/api/toys/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/toy")
      .send({ ToyId: ToyId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body);

    expect(currentUser.Credits).toBe(900);
    expect(
      currentUser.ToysInventory.some((toy) => toy.ToyId.toString() === ToyId)
    ).toBeTruthy();
  });

  test("should return 403 as the same toy already bought", async () => {
    const ToyId = await server
      .get("/api/toys/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/toy")
      .send({ ToyId: ToyId })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(403);
  });
});

describe("Buy items with credit", () => {
  test("should return 200 if everything is correct", async () => {
    const ItemId = await server
      .get("/api/items")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/item")
      .send({ ItemId: ItemId, Quantity: 3 })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body);

    expect(currentUser.Credits).toBe(600);
    expect(
      currentUser.Inventory.some((item) => item.ItemId.toString() === ItemId)
    ).toBeTruthy();
    expect(currentUser.Inventory[0].Quantity === 3).toBeTruthy();
  });

  test("increase the quantity if the user already have one", async () => {
    const ItemId = await server
      .get("/api/items/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/item")
      .send({ ItemId: ItemId, Quantity: 2 })
      .set("Authorization", "Bearer " + AuthToken);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body);

    expect(response.statusCode).toBe(200);
    expect(currentUser.Inventory[0].Quantity === 5).toBeTruthy();
  });
});

describe("Buy outfits with credit", () => {
  test("should return 200 if everything is correct", async () => {
    const OutfitId = await server
      .get("/api/outfits/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/outfit")
      .send({ OutfitId: OutfitId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body);

    expect(currentUser.Credits).toBe(300);
    expect(
      currentUser.OutfitsInventory.some(
        (outfit) => outfit.OutfitId.toString() === OutfitId
      )
    ).toBeTruthy();
  });

  test("should return 403 as the same outfit already bought", async () => {
    const OutfitId = await server
      .get("/api/outfits/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/buy/outfit")
      .send({ OutfitId: OutfitId })
      .set("Authorization", "Bearer " + AuthToken);

    expect(response.statusCode).toBe(403);
  });
});

describe("Use an item", () => {
  test("should return 200", async () => {
    const ItemId = await server
      .get("/api/items/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/use/item")
      .send({ ItemId: ItemId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => {
        return res.body;
      });

    expect(currentUser.Inventory[0].Quantity === 4).toBeTruthy();
  });
});

describe("Equip an outfit", () => {
  test("should return 200", async () => {
    const OutfitId = await server
      .get("/api/outfits/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[0]._id);

    const response = await server
      .post("/api/user/action/equip/outfit")
      .send({ OutfitId: OutfitId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => {
        return res.body;
      });

    expect(currentUser.OutfitsInventory[0].Equipped).toBeTruthy();
  });
});

describe("Equip different outfit", () => {
  test("should return 200", async () => {
    const New_OutfitId = await server
      .get("/api/outfits/")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => res.body[1]._id);

    const responseBuyNewOutfit = await server
      .post("/api/user/action/buy/outfit")
      .send({ OutfitId: New_OutfitId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(responseBuyNewOutfit.statusCode).toBe(200);

    const response = await server
      .post("/api/user/action/equip/outfit")
      .send({ OutfitId: New_OutfitId })
      .set("Authorization", "Bearer " + AuthToken);
    expect(response.statusCode).toBe(200);

    const currentUser = await server
      .get("/api/users/current")
      .set("Authorization", "Bearer " + AuthToken)
      .then((res) => {
        return res.body;
      });

    expect(currentUser.OutfitsInventory[1].Equipped).toBeTruthy();
    expect(currentUser.OutfitsInventory[0].Equipped).toBeFalsy();
  });
});
