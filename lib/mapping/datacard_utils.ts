import {JobChildCard, JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";
import {Tag} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

export const propertiesForMapping = (mapping: Mapping) => {
    return {
        "dataTitle": titleForMapping(mapping),
        "imageUrl": thumbForMapping(mapping),
        "bodyText": descriptionForMapping(mapping),
        "textRight": textRightForMapping(mapping),
        "childrenData": [] as JobChildCard[],
        "childrenLabel": "Job(s)",
        "tags": tagsForMapping(mapping),
    }

}

export const propertiesForMappingJob = (job: JobStatus) : JobChildCard => {
    return {
        "dataTitle": {"value": job.jobId} as TextPropType,
        "tags": tagsForJobStatus(job),
        "actionButtons":[],
        onActionClick: undefined
    }
}

const titleForMapping = (mapping: Mapping) => {
    return {"value": mapping.title} as TextPropType;
}

const subtitleForMapping = (mapping: Mapping) => {
    return {"value": `Plugin: ${mapping.mappingType}`} as TextPropType;
}

const descriptionForMapping = (mapping: Mapping) => {
    return {"value": mapping.description} as TextPropType;
}

const thumbForMapping = (mapping: Mapping) => {
    return "/mapping.png";
}

export const tagsForMapping = (mapping: Mapping) => {
    let tags: Array<Tag> = new Array<Tag>;

    if (mapping.plugin) {
        mapping.plugin.inputTypes.map(input => {
            tags.push({
                color: "#90EE90",
                text: input,
                iconName: "material-symbols:input-sharp",
                tooltip: "Input"
            } as Tag);
        });
        mapping.plugin.inputTypes.map(input => {
            tags.push({
                color: "#FFCCCB",
                text: input,
                iconName: "material-symbols:output-sharp",
                tooltip: "Output"
            } as Tag);
        });
    }

    return tags;
}

export const tagsForJobStatus = (job: JobStatus) => {
    let tags: Array<Tag> = new Array<Tag>;
    switch (job.status) {
        case Status.SUBMITTED:{
            tags.push({
                color: "#A0A0A0",
                text: "Submitted",
                iconName: "material-symbols:hourglass-outline",
                tooltip: "Job is submitted."
            } as Tag);
            break;
        }
        case Status.RUNNING:{
            tags.push({
                color: "#3399FF",
                text: "Running",
                iconName: "material-symbols:smart-display-outline",
                tooltip: "Jobs is running."
            } as Tag);
            break;
        }
        case Status.SUCCEEDED: {
            tags.push({
                color: "#b5e941",
                text: "Success",
                iconName: "material-symbols:check-box-outline",
                tooltip: "Job has succeeded."
            } as Tag);
            break;
        }
        case Status.FAILED: {
            tags.push({
                color: "#EF4444",
                text: "Failed",
                iconName: "material-symbols:error-outline",
                tooltip: "Job has failed."
            } as Tag);
            break;
        }
    }
    return tags;
}

export const actionsForJobStatus = (job: JobStatus): ActionButtonInterface[]=> {
    const actions:ActionButtonInterface[] = [];
    switch(job.status){
        case Status.FAILED:{
            //delete
            actions.push({label: "Delete", iconName:"material-symbols-light:delete-outline", eventIdentifier: `deleteJob_${job.jobId}`, tooltip: "Delete Mapping Output"})
            break;
        }case Status.SUCCEEDED:{
            actions.push({label: "Download", iconName:"material-symbols-light:download", url: `http://localhost:8095${job.outputFileURI}`, tooltip: "Download Mapping Result"})
            actions.push({label: "Delete", iconName:"material-symbols-light:delete-outline", eventIdentifier: `deleteJob_${job.jobId}`, tooltip: "Delete Mapping Output"})
            break;
        }
        default:{
            //no actions
        }
    }
    return actions;
}

export const textRightForMapping = (mapping: Mapping) => {
    return {'label': "Plugin", 'value': mapping.plugin?.id} as TextPropType;
}
