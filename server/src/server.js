import express from "express";
import { errorHandler, notFound } from "./middlewares.js";
import cors from "cors";
import fetch from "node-fetch";
const app = express();

const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    error: null,
    data: "Hello from main index route",
  });
});

app.post("/run", async (req, res, next) => {
  try {
    let { code, args = undefined } = req.body;

    console.log("making request to docker");
    const response = await fetch("http://localhost:7331/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        args,
      }),
    });

    const json = await response.json();
    if (json.status !== "ok") {
      throw new Error(json.error || "failed to run code");
    }
    console.log(json);
    res.json({
      status: "ok",
      error: null,
      data: json.data,
    });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`listening at port ${port}`));
