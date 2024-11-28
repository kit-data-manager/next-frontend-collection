import {UrlAction} from "@/lib/base-repo/actions/urlAction";

export class DownloadResourceAction extends UrlAction{
    constructor(resourceId:string) {
        const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

        super(`${basePath}/api/download?resourceId=${resourceId}&type=zip`, "Download", "material-symbols-light:download", 'Download Resource');
    }
}
