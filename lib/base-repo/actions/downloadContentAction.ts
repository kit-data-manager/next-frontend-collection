import {UrlAction} from "@/lib/base-repo/actions/urlAction";

export class DownloadContentAction extends UrlAction{
    constructor(resourceId:string, filename:string) {
        const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

        super(`${basePath}/api/download?resourceId=${resourceId}&filename=${filename}&type=data`, "Download", "material-symbols-light:download", 'Download File');
    }
}
