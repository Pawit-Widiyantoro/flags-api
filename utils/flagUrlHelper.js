import { config } from "dotenv";

config();

export const addUrlFlag = (req, countryOrCountries) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = environment === 'production'
                                    ? process.env.VERCEL_URL || req.get('host')
                                    : req.get('host');
    const baseUrl = `${protocol}://${req.get('host')}`;

    if (Array.isArray(countryOrCountries)) {
        return countryOrCountries.map(country => ({
            ...country.toJSON(),
            flag: `${baseUrl}/${country.flag}`
        }));
    } else {
        return {
            ...countryOrCountries.toJSON(),
            flag: `${baseUrl}/${countryOrCountries.flag}`
        }
    }
}