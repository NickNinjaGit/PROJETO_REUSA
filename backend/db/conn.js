import { Sequelize } from "sequelize";
import "dotenv/config";

const db = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_ROOT,
    password: process.env.DB_PASSWORD,
    database: "reusa",
    logging: true
});

export default db;