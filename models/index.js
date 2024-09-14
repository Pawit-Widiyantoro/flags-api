import connection from "../config/db.js";
import Country from "./country.js";

(async() => {
    try {
        await connection.sync({ alter: true });
        console.log("Database synchronized!");    
    } catch (error) {
        console.error("Error synchronizing database ", error);
    }
})();

export { Country };