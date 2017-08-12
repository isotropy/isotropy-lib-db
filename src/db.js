const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/crawler";

const connect = async () => await MongoClient.connect(url);

const count = async collection => {
  const db = await connect();
  return await db.collection(collection).count();
};

const read = async (collection, filters = null) => {
  const db = await connect();
  const cursor = await db
    .collection(collection)
    .find(filters);
  const out = [];
  for (let doc = await cursor.next(); doc !== null; doc = await cursor.next())
    out.push(doc);
  return out;
};


const awaiter = async () => {
  const out = await read("servicenowjobs");
  console.log(out);
};

awaiter();
