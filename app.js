import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import countryRouter from "./routes/countriesRouter.js";
import { logger } from "./config/logger.js";
import { fetchAndStoreCountries } from "./services/countryService.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// fetchAndStoreCountries();

app.use("/api/countries", countryRouter);

app.listen(PORT, () => {
    const environment = process.env.NODE_ENV || 'development';
    let host;

    if (environment === 'production') {
        host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'Unknown host';  // Ensures HTTPS in production
    } else {
        host = `http://localhost:${PORT}`;  // Localhost with HTTP and port
    }

    logger.info(`Server running on ${host}`);
});

export default app;