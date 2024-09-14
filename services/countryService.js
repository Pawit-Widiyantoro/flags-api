import axios from "axios";
import { Country } from "../models/index.js";
import { downloadFlag } from "./flagDownloader.js";

export const fetchAndStoreCountries = async () => {
    try {
        const { data: countries } = await axios.get("https://restcountries.com/v3.1/all");

        for (const country of countries) {
            const { name, flags, cca3: code, population, region } = country;

            const flagFilePath = await downloadFlag(flags.svg, code);

            await Country.findOrCreate({
                where: { name: name.common },
                defaults: {
                    flag: flagFilePath,
                    code: code,
                    population: population || 0,
                    region: region || "unknown",
                }
            });
        }

        console.log("Countries data fetched and stored!");
    } catch (error) {
        console.error("Error fetching and storing countries", error);
    }
}