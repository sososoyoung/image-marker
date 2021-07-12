import { fromFile } from "file-type";
import { ImageChecker } from "./base";
import { PngChecker } from "./png";
import { JpgChecker } from "./jpg";

export const parseImage = async (imgPath: string, tag: Buffer) => {
    const type = await fromFile(imgPath);

    let parser: ImageChecker;
    switch (type?.ext) {
        case "png":
            parser = new PngChecker(imgPath, tag);
            break;
        case "jpg":
            parser = new JpgChecker(imgPath, tag);
            break;

        default:
            parser = new ImageChecker(imgPath, tag);
            break;
    }

    return parser;
};
