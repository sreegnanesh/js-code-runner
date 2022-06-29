import express from "express";
import { runCode } from "./runCode.js";
import { errorHandler, notFound } from "./middelwares.js";
import cors from "cors";
const app = express();

const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    error: null,
    data: "Hello from index route",
  });
});

app.post("/run", async (req, res, next) => {
  try {
    let { code, args = undefined } = req.body;

    const output = await runCode(code, args);
    res.json({
      status: "ok",
      error: null,
      data: output,
    });
  } catch (error) {
    next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`listening at port ${port}`));
