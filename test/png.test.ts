import path from "path";
import { parseImage } from "../src/parse";

const testImage = path.resolve(__dirname, "./data/btn_yellow.png");
const tag = Buffer.from("mim:cli", "utf8");

const test = async () => {
    const png = await parseImage(testImage, tag);
    const have = await png.haveTag();
    console.log("have:", have);
    if (!have) {
        await png.addTagAndSaveFile();
    }
};
test();
