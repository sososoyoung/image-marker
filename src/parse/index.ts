import { fromFile } from "file-type";
import { ImageChecker } from "./base";
import { PngChecker } from "./png";

export const parseImage = async (imgPath: string) => {
    const type = await fromFile(imgPath);

    let parser: ImageChecker;
    switch (type?.mime) {
        case "image/png":
            parser = new PngChecker(imgPath);
            break;

        default:
            parser = new ImageChecker(imgPath, Buffer.alloc(1));
            break;
    }

    return parser;
};
