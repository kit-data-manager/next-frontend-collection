// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

import {Profile, Session} from "next-auth";

export type DataResourcePage = {
    resources: DataResource[];
    pageSize: number;
    page: number;
    totalPages: number;
}

export type DataResource = {
    id: string;
    titles: Title[];
    creators: Creator[];
    publisher: string | undefined;
    publicationYear: string | undefined;
    language: string;
    resourceType: ResourceType;
    descriptions: Description[];
    relatedIdentifiers: RelatedIdentifier[];
    dates: Date[];
    acls: Acl[];
    rights: Right[];
    subjects: Subject[];
    embargoDate: string;
    state: State | undefined;
    lastUpdate: string;
    children: ContentInformation[];
    etag: string | null | undefined;
};

export type RelatedIdentifier = {
    identifierType: string;
    value: string;
    relationType: string;
}

export type Subject = {
    value: string;
    valueUri: string;
}

export type ResourceType = {
    value: string;
    typeGeneral: TypeGeneral;
}

export enum State {VOLATILE = "VOLATILE", FIXED = "FIXED", REVOKED = "REVOKED", GONE = "GONE"}

export enum Sort {
    NEWEST = "lastUpdate,desc",
    OLDEST = "lastUpdate,asc",
    PUBLISHER = "publisher,asc",
    PUBLICATION_YEAR_NEWEST = "publicationYear,desc",
    PUBLICATION_YEAR_OLDEST = "publicationYear,asc",
    STATE = "state,asc",
}

export enum TypeGeneral {
    AUDIOVISUAL = "AUDIOVISUAL",
    COLLECTION = "COLLECTION",
    DATASET = "DATASET",
    EVENT = "EVENT",
    IMAGE = "IMAGE",
    INTERACTIVE_RESOURCE = "INTERACTIVE_RESOURCE",
    MODEL = "MODEL",
    PHYSICAL_OBJECT = "PHYSICAL_OBJECT",
    SERVICE = "SERVICE",
    SOFTWARE = "SOFTWARE",
    SOUND = "SOUND",
    TEXT = "TEXT",
    WORKFLOW = "WORKFLOW",
    OTHER = "OTHER"
}

export type Date = {
    value: string;
    type: string;
}
export type Title = {
    id: string;
    value: string;
    titleType: string;
};

export type Creator = {
    id: string;
    familyName: string;
    givenName: string;
};

export type Description = {
    id: string;
    type: string;
    description: string;
};

export type Acl = {
    id?: string;
    sid: string;
    permission: Permission;
};


export enum Permission {
    NONE = "NONE",
    READ = "READ",
    WRITE = "WRITE",
    ADMINISTRATE = "ADMINISTRATE"
}

export type Right = {
    id: string;
    schemeId: string;
    schemeUri: string;
};

export type ContentInformation = {
    id: string;
    parentResource: DataResource;
    relativePath: string;
    contentUri: string;
    mediaType: string;
    hash: string;
    size: number;
    tags: string[];
    etag: string | null | undefined;
}

export type Tag = {
    color?: string;
    text?: string;
    iconName?: string;
    url?: string;
}

export type Pagination = {
    size: number;
    page: number;
}

export type DataResourcesSearchParams = {
    page?: Pagination;
    id?: string;
    publisher?: string;
    publicationYear?: string;
    state?: State;
    typeGeneral?: TypeGeneral;
    sort?: string;
}

export type DataResourcesSearchParamsPromise = Promise<DataResourcesSearchParams>;

export type ActuatorInfo = {
    status: number;
    branch: string;
    hash: string;
    buildTime: string;
    version: string;
}

export type KeycloakInfo = {
    status: number;
    realm: string;
}

export type KeycloakUser = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type Activity = {
    id: number;
    type: "INITIAL" | "UPDATE" | "TERMINAL";
    managed_type: string;
    author: string;
    commit_date: string;

}

export type ExtendedSession = Session & { accessToken?: string, groups?: string[] | undefined };
export type ExtendedProfile = Profile & { groups?: string[] }

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
};
