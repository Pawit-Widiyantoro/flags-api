export const addUrlFlag = (req, countryOrCountries) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

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