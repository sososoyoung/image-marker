import fs from "fs";
import { promisify } from "util";

export class ImageChecker {
    imageBuffer: Buffer | undefined;
    imagePath: string;
    tag: Buffer;
    constructor(imagePath: string, tag: Buffer) {
        this.imagePath = imagePath;
        this.tag = tag;
    }

    async load() {
        if (this.imageBuffer) {
            return;
        }
        this.imageBuffer = await promisify(fs.readFile)(this.imagePath);
    }
    async reLoadImage() {
        this.imageBuffer = await promisify(fs.readFile)(this.imagePath);
    }

    async haveTag() {
        return false;
    }

    async addTag() {
        await this.reLoadImage();
        return this.imageBuffer;
    }

    async addTagAndSaveFile(imgPath?: string) {
        const data = await this.addTag();
        if (data) {
            await promisify(fs.writeFile)(imgPath || this.imagePath, data);
        } else {
            return Promise.reject("Can't find image buffer!");
        }
    }
}
