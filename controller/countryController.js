import { Country } from "../models/index.js";
import { logger } from "../config/logger.js";
import { Op } from "sequelize";
import { addUrlFlag } from "../utils/flagUrlHelper.js";

export const getAllCountries = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const offset = page * limit;

    logger.info(`Received GET request on /api/countries - Page: ${page}, Limit: ${limit}`);

    if (isNaN(page) || page < 0 || isNaN(limit) || limit <= 0) {
        logger.warn(`Invalid page or limit numbers  - Page: ${page}, Limit: ${limit}`);
        return res.status(400).json({
            message: "Invalid page or limit numbers"
        });
    }
    
    try {
        const countries = await Country.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            limit: limit,
            offset: offset,
            order: [["name", "asc"]],
        });

        if (countries.length === 0) {
            return res.status(404).json({ message: "Country data is empty!" });
        }

        const totalCountries = await Country.count();
        const countriesWithFlagUrl = addUrlFlag(req, countries);

        logger.info("Data retrieved successfully");
        res.status(200).json({
            message: "success",
            page: page,
            limit: limit,
            total: totalCountries,
            data: countriesWithFlagUrl,
        });
    } catch (error) {
        logger.error("Error retrieving country data", error);
        res.status(500).json({ 
            message: "Internal Server Error!",
            error: error.message,
         });
    }
}

export const getCountryByCode = async (req, res) => {
    const code = req.params.code;
    logger.info(`Received GET request on /api/countries/${code}`);
    try {
        const country = await Country.findOne({ 
            where: { code: code },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
    
        if (country) {
            logger.info(`Successfully retrieving country with Code: ${code}`);

            const countryWithFlagUrl = addUrlFlag(req, country);

            res.status(200).json({
                message: "success",
                data: countryWithFlagUrl,
            });
        } else {
            logger.warn(`Country with Code ${code} not found!`);
            res.status(404).json({
                message: "country not found"
            });
        }
    } catch (error) {
        logger.error(`Error retrieving country with code ${code}: ${error.message}`, { stack: error.stack });
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const searchCountry = async (req, res) => {
    const { code, name } = req.query;

    logger.info(`Received GET request on /api/countries/search`);

    if (!code && !name) {
        return res.status(400).json({
            message: "Please provide a search query (code or name)!"
        });
    }

    try {
        const searchCriteria = [];

        if (code) {
            searchCriteria.push({ code: { [Op.like]: `%${code.toUpperCase()}%` } });
        }

        if (name) {
            searchCriteria.push({ name: { [Op.like]: `%${name}%` } });
        }

        const countries = await Country.findAll({
            where: {
                [Op.or]: searchCriteria
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (countries.length === 0) {
            return res.status(404).json({ message: "No countries found matching the keyword" });
        }

        const countriesWithFlagUrl = addUrlFlag(req, countries);

        logger.info("Countries retrieved successfully!");
        res.status(200).json({
            message: "success",
            total: countries.length,
            data: countriesWithFlagUrl,
        });
    } catch (error) {
        logger.error(`Error searching for countries: ${error.message}`, { stack: error.stack });
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export const countryByRegion = async (req, res) => {
    const { region } = req.params;

    logger.info(`Received GET request on /api/countries/region/${region}`);

    try {
        const countries = await Country.findAll({
            where: { region: { [Op.like]: `%${region}%` } },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['name', 'asc']],
        });

        if (countries.length === 0) {
            return res.status(404).json({ message: `No countries found in the region: ${region}` });
        }

        const countriesWithFlagUrl = addUrlFlag(req, countries);

        logger.info(`Countries in region ${region} retrieved successfully!`);
        res.status(200).json({
            message: "success",
            total: countries.length,
            data: countriesWithFlagUrl,
        });
    } catch (error) {
        logger.error(`Error retrieving countries in region ${region}: ${error.message}`, { stack: error.stack });
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}