import { Sequelize } from "sequelize";
import "dotenv/config";

const db = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "reusa",
});

export default db;