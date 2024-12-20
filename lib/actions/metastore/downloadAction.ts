import {UrlAction} from "@/lib/actions/urlAction";

export class DownloadAction extends UrlAction{
    constructor(resourceId:string, type:string, format:string) {
        const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

        super(`${basePath}/api/metastore/download?resourceId=${resourceId}&type=${type}&format=${format}`, "Download", "material-symbols-light:download", 'Download Schema');
    }
}
