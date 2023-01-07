import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

export const app: Express = express();
app.use(express.json());
// app.use("/customer", customerRoute);
// app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([]);
  await sequelize.sync();
}
setupDb();