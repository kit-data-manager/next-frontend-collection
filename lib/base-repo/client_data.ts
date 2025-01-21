import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {
    Acl,
    ActuatorInfo,
    ContentInformation,
    DataResource,
    DataResourcePage,
    KeycloakInfo,
    KeycloakUser
} from "@/lib/definitions";
import {filterFormToDataResource} from "@/lib/filter-utils";
import {fetchWithBasePath} from "@/lib/utils";

export async function fetchDataResources(page: number, size: number, filter?: FilterForm, sort?: string): Promise<DataResourcePage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let filterExample = filterFormToDataResource(filter);
        let sorting = sort;
        if (!sorting) {
            sorting = "lastUpdate,desc";
        }

        if (filterExample) {
            return await fetchWithBasePath(`/api/base-repo/list?page=${realPage}&size=${size}&sort=${sorting}`, {
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
            return await fetchWithBasePath(`/api/base-repo/list?page=${realPage}&size=${size}&sort=${sorting}`).then(async (res) => {
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
        return fetchWithBasePath(`/api/base-repo/get?resourceId=${id}`).then(res => {
            return {
                etag: res.headers.get('etag'),
                json: res.json()
            }
        }).then(async (wrapper) => {
            const resource: DataResource = await wrapper.json as DataResource;
            resource.etag = wrapper.etag;
            return resource;
        });
    } catch (error) {
        console.error('Failed to fetch resource. Error:', error);
        return Promise.reject("No resources found");
    }
}

export function getAclDiff(sids: string[], acl: Acl[]) {
    const sidDiff: string[] = [];

    sids.map((sid: string) => {
        if (!acl.find((element) => element.sid === sid)) {
            sidDiff.push(sid);
        }
    })
    return sidDiff;
}

export async function patchDataResourceForQuickShare(id: string, etag: string, sids: string[]) {
    const patch: any[] = [];
    sids.map((sid: string) => {
        patch.push({"op": "add", "path": `/acls/-`, value: {'sid': sid, 'permission': "READ"}});
    })

    try {
        return fetchWithBasePath(`/api/base-repo/patch?resourceId=${id}&etag=${etag}`, {
            method: "PATCH",
            body: JSON.stringify(patch)
        }).then(res => res.status);
    } catch (error) {
        console.error('Failed to patch resource. Error:', error);
        return Promise.reject("Failed to patch resource.");
    }
}

export async function patchDataResourceAcls(id: string, etag: string, patch: any[]) {
    try {
        return fetchWithBasePath(`/api/base-repo/patch?resourceId=${id}&etag=${etag}`, {
            method: "PATCH",
            body: JSON.stringify(patch)
        }).then(res => res.status);
    } catch (error) {
        console.error('Failed to patch resource. Error:', error);
        return Promise.reject("Failed to patch resource.");
    }
}

export async function fetchAllContentInformation(resource: DataResource, token?: string | undefined): Promise<ContentInformation[]> {
    try {
        return await fetchWithBasePath(`/api/base-repo/list?resourceId=${resource.id}`).then(res => res.json()).catch(error => {
            throw error
        });
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export async function fetchDataResourceEtag(id: string, token?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await fetchWithBasePath(`${repoBaseUrl}/api/v1/dataresources/${id}`,
            {headers: headers}).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch resource ETag. Error:', error);
        return undefined;
    }
}

export async function fetchActuatorInfo(baseUrl: string, token?: string | undefined): Promise<ActuatorInfo> {
    let branch = "unknown";
    let hash = "unknown";
    let buildTime = "unknown";
    let version = "unknown";
    let status = 0;

    try {
        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const json = await myFetch(`${baseUrl}/actuator/info`, {headers: headers}).then((response) => response.json());

        branch = json.git.branch;
        hash = json.git.commit.id;
        buildTime = json.build.time;
        version = json.build.version;
        status = 1;
    } catch (error) {
        console.error('Failed to fetch actuator info. Error:', error);
        status = -1;
    }

    return {
        branch,
        hash,
        buildTime,
        version,
        status
    } as ActuatorInfo;
}

export async function fetchActuatorHealth(serviceUrl: string, token?: string | undefined) {
    let database = "unknown";
    let databaseStatus = "unknown";
    let harddisk = 0;
    let harddiskStatus = "unknown";
    let rabbitMqStatus = "unknown";
    let rabbitMq = "unknown";
    let elasticStatus = "unknown";
    let elastic = "unknown";

    try {
        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const json = await myFetch(`${serviceUrl}/actuator/health`, {headers: headers}, true).then((response) => response.json());

        database = json.components.db.details.database;
        databaseStatus = json.components.db.status;
        harddisk = json.components.diskSpace.details.free;
        harddiskStatus = json.components.diskSpace.status;
        rabbitMqStatus = json.components.rabbitMQMessagingService?.status;
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
            elasticStatus = json.components.elasticsearch?.status;
            elastic = json.components.elasticsearch?.details.status;
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
    let status = 0;
    try {
        const response = await myFetch(`${realmUrl}`);
        const json = await response.json();
        realm = json.realm;
        status = 1;
    } catch (error) {
        console.error('Failed to fetch keycloak info. Error:', error);
        status = -1;
    }

    return {
        status,
        realm
    } as KeycloakInfo;
}

export async function fetchSchema(schemaPath: string) {
    try {
        return fetchWithBasePath(schemaPath).then(res => res.json());
    } catch (error) {
        console.error('Failed to fetch schema. Error:', error);
        return undefined;
    }
}

export async function fetchUsers(filter: string | undefined): Promise<KeycloakUser[]> {
    try {
        if (filter) {
            return await fetchWithBasePath(`/api/auth/users?filter=${filter}`).then(res => res.json()).catch(error => {
                throw error
            });
        }

        return await fetchWithBasePath(`/api/auth/users`).then(res => res.json()).catch(error => {
            throw error
        });
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export class ResponseError extends Error {
    public response: string;

    constructor(message, res) {
        super(message);
        this.response = res;
    }
}

export async function myFetch(url: string, init?: any, onlyExpectBody: boolean = false) {
    let res: Response = await fetch(url, init);
    if (!res.ok && !onlyExpectBody) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}

export async function updateDataResource(resource: object, etag: string) {
    const headers = {
        "Content-Type": "application/json",
        "If-Match": etag
    };

    const response = await fetchWithBasePath(`/api/base-repo/update?resourceId=${resource["id"]}&etag=${etag}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(resource)
    });

    if (response.status === 200) {
        return response.status;
    } else {
        throw new ResponseError('Failed to update resource.', response);
    }
}

export async function createDataResource(resource: DataResource) {
    const headers = {
        "Content-Type": "application/json"
    };
    const response = await fetchWithBasePath(`/api/base-repo/create_resource`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(resource)
    });

    if (response.status === 201) {
        return response.json();
    } else {
        throw new ResponseError('Failed to create resource.', response);
    }
}
