import {Acl, Tag} from "@/lib/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

export type MappingPlugin = {
    id: string;
    name: string;
    version: string;
    description: string;
    sourceUri: string;
    inputTypes: string[];
    outputTypes: string[];
};

export type Mapping={
    mappingId:string;
    image:string;
    mappingType:string;
    plugin?:MappingPlugin;
    title:string;
    description:string;
    acl: Acl[];
    mappingDocumentUri:string;
    documentHash:string;
}

export type MappingPage = {
    resources: Mapping[];
    pageSize: number;
    page: number;
    totalPages:number;
}
export enum Status {
    SUBMITTED = "SUBMITTED",
    RUNNING= "RUNNING",
    SUCCEEDED= "SUCCEEDED",
    FAILED= "FAILED",
    DELETED= "DELETED"
}
export type JobStatus = {
    mappingId:string;
    jobId: string;
    file:string;
    status: Status;
    error?: string;
    outputFileURI?: string;
}

export type JobChildCard = {
    dataTitle: TextPropType;
    tags: Tag[];
    actionButtons: ActionButtonInterface[];
    onActionClick: any;
}
