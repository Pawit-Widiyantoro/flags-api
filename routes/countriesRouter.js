import express from "express";
import { countryByRegion, getAllCountries, getCountryByCode, searchCountry } from "../controller/countryController.js";

const router = express.Router();

// all countries
router.get("/", getAllCountries);

// search country
router.get("/search", searchCountry);

// country by region
router.get("/region/:region", countryByRegion);

// single country
router.get('/:code', getCountryByCode);

export default router;