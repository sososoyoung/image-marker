import Debug from "debug";
import { ImageChecker } from "./base";
import * as piexif from "piexifjs";

const debug = Debug("img:parse:jpg");

const parseJpg = (data: Buffer) => {
    const base64Str = "data:image/jpg;base64," + data.toString("base64");
    const exifData = piexif.load(base64Str);
    return exifData["0th"];
};

const addTag = (data: Buffer, tag: Buffer) => {
    const imageData = parseJpg(data);
    const zeroth = {
        ...imageData,
        [piexif.ImageIFD.Software]: tag.toString("utf8"),
    };
    const exifStr = piexif.dump({ "0th": zeroth });
    const inserted = piexif.insert(exifStr, "data:image/jpg;base64," + data.toString("base64"));
    return Buffer.from(inserted.split(",")[1], "base64");
};

const haveTag = (data: Buffer, tag: Buffer) => {
    const imageData = parseJpg(data);
    return imageData && imageData[piexif.ImageIFD.Software] === tag.toString("utf8");
};

export class JpgChecker extends ImageChecker {
    imageInfo: Record<string, string> | undefined;
    constructor(imagePath: string, tag: Buffer) {
        super(imagePath, tag);
    }

    async load() {
        if (!this.imageBuffer) {
            await super.load();
        }
    }

    async reLoadImage() {
        await super.reLoadImage();
    }

    async haveTag() {
        await this.load();
        return haveTag(this.imageBuffer!, this.tag);
    }

    async addTag() {
        await this.reLoadImage();
        return addTag(this.imageBuffer!, this.tag);
    }
}
