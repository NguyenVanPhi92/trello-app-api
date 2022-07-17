import express from "express";
import { mapOrder } from "*/utilities/sorts";
import { connectDB } from "./config/mongodb";

const app = express();

const hostname = "localhost";
const port = 8017;

// run connect DB
connectDB().catch(console.log);

app.get("/", (req, res) => {
  res.send("<h1>hello word</h1>");
});

app.listen(port, hostname, () => {
  console.log("server is running");
});
