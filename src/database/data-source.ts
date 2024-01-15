import "reflect-metadata";
import { DataSource } from "typeorm";
// import { CreateRoles1704826648215 } from "./migrations/1704826648215-CreateRoles";

// ----------------------------------------------------------------

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "secret",
  database: "inkoni",
  entities: [`${__dirname}/../models/**/*{.js,.ts}`],
  migrations: [`${__dirname}/migrations/**/*{.js,.ts}`],
  synchronize: false,
  logging: false,
});

//console.log(`${__dirname}/migrations`);
