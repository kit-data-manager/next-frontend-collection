import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {
    Acl, ActuatorHealth,
    ActuatorInfo,
    ContentInformation,
    DataResource,
    DataResourcePage,
    KeycloakInfo,
    KeycloakUser
} from "@/lib/definitions";
import {filterFormToDataResource} from "@/app/base-repo/components/FilterForm/filter-utils";
import {fetchWithBasePath} from "@/lib/general/utils";
import {humanFileSize} from "@/lib/general/format-utils";

export async function fetchDataResources(page: number, size: number, filter?: FilterForm, sort?: string, accessToken?: string | undefined): Promise<DataResourcePage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let filterExample = filterFormToDataResource(filter);
        let sorting = sort;
        if (!sorting) {
            sorting = "lastUpdate,desc";
        }

        const headers = {
            "Accept": "application/json"
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

        if (filterExample) {
            headers["Content-Type"] = "application/json";
            return await fetch(`${repoBaseUrl}/api/v1/dataresources/search?page=${realPage}&size=${size}&sort=${sorting}`, {
                method: "POST",
                headers: headers,
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
            return await fetch(`${repoBaseUrl}/api/v1/dataresources/?page=${realPage}&size=${size}&sort=${sorting}`, {
                method: "GET",
                headers: headers
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
        }
    } catch (error) {
        console.error('Service Error:', error);
        return Promise.reject("No resources found");
    }
}

export async function fetchDataResource(resourceId: string, accessToken?: string | undefined): Promise<DataResource> {
    try {
        const headers = {
            "Accept": "application/json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

        return fetch(`${repoBaseUrl}/api/v1/dataresources/${resourceId}`, {
            method: "GET",
            headers: headers
        }).then(res => {
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

export async function patchDataResourceForQuickShare(resourceId: string, etag: string, sids: string[], accessToken?: string | undefined) {
    const patch: any[] = [];
    sids.map((sid: string) => {
        patch.push({"op": "add", "path": `/acls/-`, value: {'sid': sid, 'permission': "READ"}});
    })

    const headers = {
        "If-Match": etag,
        "Content-Type": "application/json-patch+json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    try {
        return fetch(`${repoBaseUrl}/api/v1/dataresources/${resourceId}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(patch)
        }).then(res => res.status);
    } catch (error) {
        console.error('Failed to patch resource. Error:', error);
        return Promise.reject("Failed to patch resource.");
    }
}

export async function patchDataResourceAcls(resourceId: string, etag: string, patch: any[], accessToken?: string | undefined) {
    try {
        const headers = {
            "If-Match": etag,
            "Content-Type": "application/json-patch+json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

        return fetch(`${repoBaseUrl}/api/v1/dataresources/${resourceId}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(patch)
        }).then(res => res.status);
    } catch (error) {
        console.error('Failed to patch resource. Error:', error);
        return Promise.reject("Failed to patch resource.");
    }
}

export async function fetchAllContentInformation(resource: DataResource, accessToken?: string | undefined): Promise<ContentInformation[]> {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/vnd.datamanager.content-information+json"};
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        //fetch max. number of content elements (100)
        return await fetch(`${repoBaseUrl}/api/v1/dataresources/${resource.id}/data/?page=0&size=100`, {
            method:"GET",
            headers: headers
        }).then(res => res.json()).catch(error => {
            throw error
        });
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export async function fetchDataResourceEtag(id: string, accessToken?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return await fetch(`${repoBaseUrl}/api/v1/dataresources/${id}`,
            {
                method:"GET",
                headers: headers
            }).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch resource ETag. Error:', error);
        return undefined;
    }
}

export async function fetchContentInformationEtag(id: string, filename:string,  accessToken?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/vnd.datamanager.content-information+json"};
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return await fetch(`${repoBaseUrl}/api/v1/dataresources/${id}/data/${filename}`,
            {
                method:"GET",
                headers: headers
            }).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch content information ETag. Error:', error);
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

export async function fetchActuatorHealth(serviceUrl: string, token?: string | undefined)  {
    let healthStatus:ActuatorHealth = {harddisk:{status:"unknown"}, database:{status:"unknown"}, rabbitMq:{status:"unknown"}, elastic:{status:"unknown"}};

    try {
        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const json = await myFetch(`${serviceUrl}/actuator/health`, {headers: headers}, true).then((response) => response.json());

        healthStatus.database.details = `Database Type ${json.components.db.details.database}`;
        healthStatus.database.status  = json.components.db.status;
        healthStatus.harddisk.details  = `Harddisk ${humanFileSize(json.components.diskSpace.details.free)} free`
        healthStatus.harddisk.status = json.components.diskSpace.status;
        healthStatus.rabbitMq.status = json.components.rabbitMQMessagingService?.status;
        if (json.components.hasOwnProperty("rabbit") &&
            json.components.rabbit.hasOwnProperty("details") &&
            json.components.rabbit.details.hasOwnProperty("version")) {
            healthStatus.rabbitMq.details = `RabbitMQ Version ${json.components.rabbit.details.version}`
        }
        if (json.components.hasOwnProperty("elasticsearch") &&
            json.components.elasticsearch.hasOwnProperty("status") &&
            json.components.elasticsearch.hasOwnProperty("details") &&
            json.components.elasticsearch.details.hasOwnProperty("status")) {
            healthStatus.elastic.status = json.components.elasticsearch?.status;
            healthStatus.elastic.details = `Elasticsearch Status ${json.components.elasticsearch?.details.status}`;
        }
    } catch (error) {
        console.error('Failed to fetch actuator health. Error:', error);
    }

    return healthStatus;
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

export async function updateDataResource(resource: object, etag: string, accessToken?: string) {
    const headers = {
        "Content-Type": "application/json",
        "If-Match": etag
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

    const response = await fetch(`${baseUrl}/api/v1/dataresources/${resource['id']}`, {
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

export async function createDataResource(resource: DataResource, accessToken?: string | undefined) {
    const headers = {
        "Content-Type": "application/json"
    };
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

    const response = await fetch(`${baseUrl}/api/v1/dataresources/`, {
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
