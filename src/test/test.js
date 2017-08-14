import should from "should";
import { MongoClient } from "mongodb";
import * as mongo from "../db";

const connectionString = "mongodb://localhost:27017/mongodriver";
const collection = "test";

const connect = async connectionString =>
  await MongoClient.connect(connectionString);

describe("lib-postgres", () => {
  beforeEach(async () => {
    await mongo.insert(connectionString, collection, [{ a: 1 }]);
    const db = await connect(connectionString);
    await db.collection(collection).drop();
  });

  it("read", async () => {
    await mongo.insert(connectionString, collection, [{ a: 1 }]);
    const readData = await mongo.read(connectionString, collection);
    readData[0].a.should.equal(1);
  });

  it("insert", async () => {
    await mongo.insert(connectionString, collection, [
      { a: 1 },
      { b: 2 },
      { c: 3 }
    ]);
    const insertCount = await mongo.count(connectionString, collection);
    insertCount.should.equal(3);
  });

  it("update", async () => {
    await mongo.insert(connectionString, collection, [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 }
    ]);
    await mongo.update(
      connectionString,
      collection,
      { a: { $gt: 2 } },
      { $set: { updated: true } }
    );
    const updateData = await mongo.read(connectionString, collection, {
      updated: true
    });
    updateData[0].a.should.equal(3) && updateData[1].a.should.equal(4);
  });

  it("delete", async () => {
    await mongo.insert(connectionString, collection, [
      { a: 1, b: 2 },
      { a: 1, b: 3 },
      { a: 3, b: 4 },
      { a: 4, b: 5 }
    ]);
    await mongo.remove(connectionString, collection, { a: 1 });
    const deleteCount = await mongo.count(connectionString, collection);
    deleteCount.should.equal(2);
  });

  it("count", async () => {
    await mongo.insert(connectionString, collection, [
      { a: 1 },
      { b: 2 }
    ]);
    const insertCount = await mongo.count(connectionString, collection);
    insertCount.should.equal(2);
  });
});
