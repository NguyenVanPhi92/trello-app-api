import express from "express";
import { mapOrder } from "*/utilities/sorts";

const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/", (req, res) => {
  res.send("<h1>hello word</h1>");
});

app.listen(port, hostname, () => {
  console.log("server is running");
});
