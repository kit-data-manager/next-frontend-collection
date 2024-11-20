import {Acl, DataResource} from "@/lib/definitions";

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