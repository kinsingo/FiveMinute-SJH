import { Db, MongoClient, ServerApiVersion } from "mongodb";

const URI = process.env.MONGO_URI;
if (!URI)
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let publicDB: Db | null = null;
let connectedClient: MongoClient | null = null;

async function getConnectedClient() {
  if (!connectedClient) 
    connectedClient = await client.connect();
  return connectedClient;
}

async function getConnectedPublicDB() {
  if (!publicDB) {
    try {
      const _connectedClient = await getConnectedClient();
      publicDB = _connectedClient.db("fiveminute-db");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  }
  return publicDB;
}

async function getPublicCollection(collectionName: string) {
  const _publicDB = await getConnectedPublicDB();
  if (!_publicDB) {
    throw new Error("Failed to connect to the database.");
  }
  return _publicDB.collection(collectionName);
}


async function createPublicCollection(collectionName: string) {
  const _publicDB = await getConnectedPublicDB();
  if (!_publicDB) {
    throw new Error("Failed to connect to the database.");
  }
  await _publicDB.createCollection(collectionName);
}

enum InventoryCollectionName {
  bundang = "inventory-status-bundang",
  gangnam = "inventory-status-gangnam",
  sinlim = "inventory-status-sinlim",
}

export { getPublicCollection, createPublicCollection, getConnectedPublicDB, InventoryCollectionName };
