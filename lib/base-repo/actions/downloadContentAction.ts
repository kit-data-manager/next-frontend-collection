import {UrlAction} from "@/lib/base-repo/actions/urlAction";

export class DownloadContentAction extends UrlAction{
    constructor(resourceId:string, filename:string) {
        super(`/api/download?resourceId=${resourceId}&filename=${filename}&type=data`, "Download", "material-symbols-light:download", 'Download File');
    }
}
