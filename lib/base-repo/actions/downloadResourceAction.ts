import {UrlAction} from "@/lib/base-repo/actions/urlAction";

export class DownloadResourceAction extends UrlAction{
    constructor(resourceId:string) {
        super(`/api/download?resourceId=${resourceId}&type=zip`, "Download", "material-symbols-light:download", 'Download Resource');
    }
}
