import Debug from "debug";
import { ImageChecker } from "./base";

const debug = Debug("img:parse:png");

type PngInfo = Record<string, { start: number; end: number }[]>;

export const parsePng = (data: Buffer) => {
    let start = 8;
    const pngData: PngInfo = {};
    while (start < data.length) {
        // 先读取chunk的前四个字节，得到数据的长度
        const len = data.slice(start, start + 4).readInt32BE();
        // 再读取4个字节，得到数据chunk的类型
        const type = data.slice(start + 4, start + 8).toString("utf8");

        const end = start + 8 + len;
        debug(`[png:type]: ${type}\tstart: ${start - 8}\tlen: ${len}\tleft: ${data.length - start - len - 8}`);

        if (!pngData[type]) {
            pngData[type] = [];
        }
        pngData[type].push({
            start,
            end,
        });

        start = 4 + end;
    }

    debug("[png:data]: ", pngData);
    return pngData;
};

export const readPngTag = (image: Buffer, pngInfo?: PngInfo) => {
    const data = pngInfo || parsePng(image);
    if (data.tEXt && data.tEXt.length) {
        return image.slice(data.tEXt[data.tEXt.length - 1].start, data.tEXt[data.tEXt.length - 1].end);
    }
    return undefined;
};

export const addPngTag = (image: Buffer, tag: Buffer, pngInfo?: PngInfo) => {
    const data = pngInfo || parsePng(image);
    const len = Buffer.alloc(4);
    const type = Buffer.alloc(4);
    len.writeInt32BE(tag.length);
    type.write("tEXt", "utf8");

    const tEXtBuffer = Buffer.concat([len, type, tag, Buffer.alloc(4)]);
    let IENDStart = data.IEND[0].start;

    return Buffer.concat([image.slice(0, IENDStart), tEXtBuffer, image.slice(IENDStart)]);
};

export const haveTag = (image: Buffer, tag: Buffer, pngInfo?: PngInfo) => {
    const tEXt = readPngTag(image, pngInfo);
    const have = tEXt && tEXt.slice(tEXt.length - tag.length).toString("hex") === tag.toString("hex");
    return Boolean(have);
};

export class PngChecker extends ImageChecker {
    pngInfo: PngInfo | undefined;
    constructor(imagePath: string, tag: Buffer) {
        super(imagePath, tag);
    }

    async load() {
        if (!this.imageBuffer) {
            await super.load();
        }
        if (!this.pngInfo) {
            this.pngInfo = parsePng(this.imageBuffer!);
        }
    }

    async reLoadImage() {
        await super.reLoadImage();
        this.pngInfo = parsePng(this.imageBuffer!);
    }

    async haveTag() {
        await this.load();
        return haveTag(this.imageBuffer!, this.tag, this.pngInfo);
    }

    async addTag() {
        await this.reLoadImage();
        return addPngTag(this.imageBuffer!, this.tag, this.pngInfo);
    }
}
