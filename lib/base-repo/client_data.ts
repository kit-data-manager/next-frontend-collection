import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {ActuatorInfo, ContentInformation, DataResource, DataResourcePage, KeycloakInfo} from "@/lib/definitions";
import {filterFormToDataResource} from "@/lib/filter-utils";

export async function fetchDataResources(page: number, size: number, filter?: FilterForm, sort?: string, token?: string | undefined): Promise<DataResourcePage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let filterExample = filterFormToDataResource(filter);
        let sorting = sort;
        if (!sorting) {
            sorting = "lastUpdate,desc";
        }

        if (filterExample) {
            return await myFetch(`/api/list?page=${realPage}&size=${size}&sort=${sorting}`, {
                method: "POST",
                body: JSON.stringify(filterExample)
            }).then(async (res) => {
                const resourcePage: DataResourcePage = {} as DataResourcePage;
                resourcePage.resources = await res.json();
                resourcePage.page = page;
                resourcePage.pageSize = size;
                const contentRange: string | null = res.headers.get('content-range');

                if (contentRange) {
                    const totalElements = Number(contentRange.substring(contentRange.lastIndexOf("/") + 1));
                    resourcePage.totalPages = Math.ceil(totalElements / size);
                }
                return resourcePage;
            });
        } else {
            return await myFetch(`/api/list?page=${realPage}&size=${size}&sort=${sorting}`).then(async (res) => {
                const resourcePage: DataResourcePage = {} as DataResourcePage;
                resourcePage.resources = await res.json();
                resourcePage.page = page;
                resourcePage.pageSize = size;
                const contentRange: string | null = res.headers.get('content-range');

                if (contentRange) {
                    const totalElements = Number(contentRange.substring(contentRange.lastIndexOf("/") + 1));
                    resourcePage.totalPages = Math.ceil(totalElements / size);
                }
                return resourcePage;
            });
        }
    } catch (error) {
        console.error('Service Error:', error);
        return Promise.reject("No resources found");
    }
}

export async function fetchDataResource(id: string, token?: string | undefined): Promise<DataResource> {
    try {
        return myFetch(`/api/get?resourceId=${id}`).then(res => ({
            etag: res.headers.get('etag'),
            json: res.json()
        })).then(async (wrapper) => {
            const resource: DataResource = await wrapper.json as DataResource;
            resource.etag = wrapper.etag;
            return resource;
        });
    } catch (error) {
        console.error('Failed to fetch resource. Error:', error);
        return Promise.reject("No resources found");
    }
}

export async function fetchAllContentInformation(resource: DataResource, token?: string | undefined): Promise<ContentInformation[]> {
    try {
        return await myFetch(`/api/list?resourceId=${resource.id}`).then(res => res.json()).catch(error => {
            throw error
        });
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export async function fetchContentInformation(id: string, filename:string, token?: string | undefined) {
    try {
        return myFetch(`/api/get?resourceId=${id}&filename=${filename}`).then(res => ({
            etag: res.headers.get('etag'),
            json: res.json()
        })).then(async (wrapper) => {
            const resource: ContentInformation = await wrapper.json as ContentInformation;
            resource.etag = wrapper.etag;
            return resource;
        });
    } catch (error) {
        console.error('Failed to fetch content metadata. Error:', error);
        return undefined;
    }
}

export async function fetchDataResourceEtag(id: string, token?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${repoBaseUrl}/api/v1/dataresources/${id}`,
            {headers: headers}).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch resource ETag. Error:', error);
        return undefined;
    }
}

export async function fetchActuatorInfo(token?: string | undefined): Promise<ActuatorInfo> {
    let branch = "unknown";
    let hash = "unknown";
    let buildTime = "unknown";
    let version = "unknown";

    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const json = await myFetch(`${repoBaseUrl}/actuator/info`, {headers: headers}).then((response) => response.json());

        branch = json.git.branch;
        hash = json.git.commit.id;
        buildTime = json.build.time;
        version = json.build.version;
    } catch (error) {
        console.error('Failed to fetch actuator info. Error:', error);
    }

    return {
        branch,
        hash,
        buildTime,
        version
    } as ActuatorInfo;
}

export async function fetchActuatorHealth(token?: string | undefined) {
    let database = "unknown";
    let databaseStatus = "unknown";
    let harddisk = 0;
    let harddiskStatus = "unknown";
    let rabbitMqStatus = "unknown";
    let rabbitMq = "unknown";
    let elasticStatus = "unknown";
    let elastic = "unknown";

    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const json = await myFetch(`${repoBaseUrl}/actuator/health`, {headers: headers}).then((response) => response.json());

        database = json.components.db.details.database;
        databaseStatus = json.components.db.status;
        harddisk = json.components.diskSpace.details.free;
        harddiskStatus = json.components.diskSpace.status;
        rabbitMqStatus = json.components.rabbitMQMessagingService.status;
        rabbitMq = "unknown";
        if (json.components.hasOwnProperty("rabbit") &&
            json.components.rabbit.hasOwnProperty("details") &&
            json.components.rabbit.details.hasOwnProperty("version")) {
            rabbitMq = json.components.rabbit.details.version;
        }
        elasticStatus = "unknown";
        elastic = "unknown";
        if (json.components.hasOwnProperty("elasticsearch") &&
            json.components.elasticsearch.hasOwnProperty("status") &&
            json.components.elasticsearch.hasOwnProperty("details") &&
            json.components.elasticsearch.details.hasOwnProperty("status")) {
            elasticStatus = json.components.elasticsearch.status;
            elastic = json.components.elasticsearch.details.status;
        }
    } catch (error) {
        console.error('Failed to fetch actuator health. Error:', error);
    }

    return {
        databaseStatus,
        database,
        harddiskStatus,
        harddisk,
        rabbitMqStatus,
        rabbitMq,
        elasticStatus,
        elastic
    }
}

export async function fetchKeyCloakStatus(realmUrl: string) {
    let realm = "unknown";

    try {
        const response = await myFetch(`${realmUrl}`);

        const json = await response.json();

        realm = json.realm;
    } catch (error) {
        console.error('Failed to fetch keycloak info. Error:', error);
    }

    return {
        realm
    } as KeycloakInfo;
}

export async function fetchSchema(schemaPath: string) {
    try {
        return myFetch(schemaPath).then(res => res.json());
    } catch (error) {
        console.error('Failed to fetch schema. Error:', error);
        return undefined;
    }
}

export class ResponseError extends Error {
    public response: string;

    constructor(message, res) {
        super(message);
        this.response = res;
    }
}

export async function myFetch(url: string, init?: any) {
    let res: Response;
    if (init) {
        res = await fetch(url, init);
    } else {
        res = await fetch(url);
    }
    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}
