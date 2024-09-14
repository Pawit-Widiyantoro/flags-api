import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const flagsDir = path.join(__dirname, "public", "flags");
if (!fs.existsSync(flagsDir)) {
    fs.mkdirSync(flagsDir, { recursive: true });
}

export const downloadFlag = async (flagURL, countryCode) => {
    const flagPath = path.join(flagsDir, `${countryCode}.svg`);
    const writer = fs.createReadStream(flagPath);

    const response = await axios({
        url: flagURL,
        method: "GET",
        responseType: "stream",
    });

    return new Promise((res, rej) => {
        writer.on("finish", () => res(`flags/${countryCode}.svg`));
        writer.on("error", rej);
        response.data.pipe(writer);
    });
}