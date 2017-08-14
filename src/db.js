const MongoClient = require("mongodb").MongoClient;

const connectionString = "mongodb://localhost:27017/mongodriver";

const connect = async connectionString =>
  await MongoClient.connect(connectionString);

const cursorReader = async cursor => {
  const out = [];
  for (let doc = await cursor.next(); doc !== null; doc = await cursor.next())
    out.push(doc);
  return out;
};

export async function count(connectionString, collection) {
  const db = await connect(connectionString);
  return await db.collection(collection).count();
}

export async function insert(connectionString, collection, data) {
  const db = await connect(connectionString);
  db.collection(collection).insertMany(data);
}

export async function read(
  connectionString,
  collection,
  filters = null,
  sortFilters = null
) {
  const db = await connect(connectionString);
  const cursor = await db
    .collection(collection)
    .find(filters)
    .sort(sortFilters);
  return cursorReader(cursor);
}

export async function update(connectionString, collection, filters = null, data) {
  const db = await connect(connectionString);
  return await db.collection(collection).updateMany(filters, data);
}

export async function remove(connectionString, collection, filters = null) {
  const db = await connect(connectionString);
  return await db.collection(collection).deleteMany(filters);
}

const awaiter = async () => {
  const out = await read(connectionString, "test", null, { number: -1 });
  console.log(out);
};

awaiter();
