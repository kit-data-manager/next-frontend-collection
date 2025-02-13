import {fetchLatestActivities} from "@/lib/base-repo/server-data";
import {formatDateToLocal} from "@/lib/general/format-utils";
import ActivityList from "@/components/ActivityList/ActivityList";

export type Activity = {
    icon:string;
    title:string;
    subtitle:string;
    date:string;
};

export default async function LatestActivities() {
    const latestActivities = await fetchLatestActivities();

    let activities: Array<Activity> = [];

    latestActivities.map((v) => {
        let activity:Activity = {} as Activity;
        const elementType = v.managed_type == "edu.kit.datamanager.repo.domain.ContentInformation" ? "File" : "Resource"

        switch (v.type) {
            case "INITIAL":
                activity.title = `${elementType} created`;
                activity.icon = "grommet-icons:new";
                break;
            case "UPDATE":
                activity.title = `${elementType} updated`;
                activity.icon = "ic:baseline-autorenew";
                break;
            case "TERMINAL":
                activity.title = `${elementType} deleted`;
                activity.icon = "typcn:delete-outline";
                break;
        }

        activity.subtitle = v.author;
        activity.date = formatDateToLocal(v.commit_date);
        activities.push(activity);
    });

    return (
        <ActivityList activities={activities}/>
    )
}
