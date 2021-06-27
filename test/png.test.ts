import path from "path";
import { parseImage } from "../src/parse";

const testImage = path.resolve(__dirname, "./data/test.png");

const test = async () => {
    const png = await parseImage(testImage);
    const have = await png.haveTag();
    console.log("have:", have);
    if (!have) {
        await png.addTagAndSaveFile();
    }
};
test();
