const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/mongodriver";

const connect = async () => await MongoClient.connect(url);

const cursorReader = async cursor => {
  const out = [];
  for (let doc = await cursor.next(); doc !== null; doc = await cursor.next())
    out.push(doc);
  return out;
};

async function count(collection) {
  const db = await connect();
  return await db.collection(collection).count();
}

async function insert(collection, data) {
  const db = await connect();
  db.collection(collection).insertMany(data);
}

async function read(collection, filters = null, sortFilters = null) {
  const db = await connect();
  const cursor = await db
    .collection(collection)
    .find(filters)
    .sort(sortFilters);
  return cursorReader(cursor);
}

async function update(collection, filters = null, data) {
  const db = await connect();
  db.collection(collection).updateMany(filters, data);
}

async function remove(collection, filters = null) {
  const db = await connect();
  db.collection(collection).deleteOne(filters);
}

const awaiter = async () => {
  const out = await read("test", null, { number: -1 });
  console.log(out);
};

awaiter();
