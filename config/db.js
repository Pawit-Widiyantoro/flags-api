import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { config } from "dotenv";

config();

const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
);

connection.authenticate()
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err.message);
        console.error("Error details:", err);
    });

export default connection;
