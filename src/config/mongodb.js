import { MongoClient } from "mongodb";
import { env } from "./evnirontment";

let dbInstance = null;

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  // Connect the client to server
  await client.connect();

  // Assign clientDB to our dbInstance
  dbInstance = client.db(env.DATABASE_NAME);
};

//Get database Instance
export const getDB = () => {
  if (!dbInstance) throw Error("Must connect to Database first!");
  return dbInstance;
};

// LOGGER

// const listDatabase = async (client) => {
// const databasesList = await client.db().admin().listDatabases();
//   console.log(databasesList);

//   console.log("Your databases: ");
//   databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
// };
