import {Action} from "@/lib/actions/action";

export class UrlAction extends Action{
    constructor(private url: string, label:string, iconName:string, tooltip:string) {
        super(url, label, iconName, tooltip);
        this.isLink = true;
    }
}
