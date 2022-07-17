import { MongoClient } from "mongodb";
import { env } from "./evnirontment";

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  try {
    // Connect the client to server
    await client.connect();
    console.log("Connect successfully to server");

    //List database
    await listDatabase(client);
  } finally {
    // sau khi chạy all thì close khi thành công or error
    await client.close();
    console.log("Close");
  }
};

const listDatabase = async (client) => {
  const databasesList = await client.db().admin().listDatabases();
  console.log(databasesList);

  console.log("Your databases: ");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
};
