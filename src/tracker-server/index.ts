import "reflect-metadata";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { validateAndSanitize } from "./validation/Track";
import { AppDataSource } from "./repo/TrackRepository";

const main = async () => {
  const repo = await AppDataSource.initialize();
  console.log('Connected to MongoDB server.')

  const app = express();
  const port = process.env.PORT || 8001;
  app.use(cors({ origin: "*" }));
  app.use(express.static(__dirname + "/public"));
  app.use(bodyParser.json({ type: ["application/json", "text/plain"] }));

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/tracker.js");
  });

  app.post("/track", async (req, res) => {
    res.sendStatus(200);
    try {
      const sessionBuffer = await validateAndSanitize(req.body);
      await repo.manager.save(sessionBuffer.tracks);
    } catch (error) {
      console.log(error);
    }
  });

  app.listen(port, () => console.log(`Tracker is listening on port ${port}.`));
};

main();
