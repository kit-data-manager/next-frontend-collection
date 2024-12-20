import {UrlAction} from "@/lib/actions/urlAction";

export class DownloadResourceAction extends UrlAction{
    constructor(resourceId:string) {
        const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

        super(`${basePath}/api/base-repo/download?resourceId=${resourceId}&type=zip`, "Download", "material-symbols-light:download", 'Download Resource');
    }
}
