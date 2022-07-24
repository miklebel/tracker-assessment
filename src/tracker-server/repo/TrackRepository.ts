import { Track } from "../entities/Track";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  database: "test",
  synchronize: true,
  logging: true,
  entities: [Track],
  subscribers: [],
  migrations: [],
  useUnifiedTopology: true,
});
