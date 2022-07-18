import express from "express";
import { connectDB, getDB } from "./config/mongodb";
import { env } from "./config/evnirontment";
import { BoardModel } from "*/models/board.model";

// run connect DB
connectDB()
  .then(() => console.log("Connect successfully to database server"))
  .then(() => bootServer()) // khi thành công thì start server DB
  .catch((error) => {
    console.log("Error connect database: ", error);
    process.exit(1); // khi có lỗi thì dừng ứng dụng
  });

const bootServer = () => {
  const app = express();

  app.get("/test", async (req, res) => {
    res.send("<h1>hello word</h1>");
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log("server is running");
  });
};
