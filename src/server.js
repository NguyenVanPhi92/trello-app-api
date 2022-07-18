import express from "express";
import { connectDB, getDB } from "./config/mongodb";
import { env } from "./config/evnirontment";
import { BoardModel } from "*/models/board.model";
import { apiV1 } from "*/routes/v1/";

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

  //  Enable req.body data
  app.use(express.json());
  // route API v1
  app.use("/v1", apiV1);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log("server is running");
  });
};
