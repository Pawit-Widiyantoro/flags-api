import { DataTypes } from "sequelize";
import connection from "../config/db.js";

const Country = connection.define("country", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    flag: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
    population: {
        type: DataTypes.INTEGER,
    },
    region: {
        type: DataTypes.STRING,
    }
});

export default Country;