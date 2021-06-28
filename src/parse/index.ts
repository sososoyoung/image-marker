import { fromFile } from "file-type";
import { ImageChecker } from "./base";
import { PngChecker } from "./png";

export const parseImage = async (imgPath: string, tag: Buffer) => {
    const type = await fromFile(imgPath);

    let parser: ImageChecker;
    switch (type?.mime) {
        case "image/png":
            parser = new PngChecker(imgPath, tag);
            break;

        default:
            parser = new ImageChecker(imgPath, tag);
            break;
    }

    return parser;
};
