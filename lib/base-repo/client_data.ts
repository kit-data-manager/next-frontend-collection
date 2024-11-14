import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {ActuatorInfo, ContentInformation, DataResource, KeycloakInfo} from "@/lib/definitions";
import {filterFormToDataResource} from "@/lib/filter-utils";


export async function fetchDataResources(page: number, size: number, filter?: FilterForm, token?: string | undefined): Promise<DataResource[]> {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        const realPage = page - 1;
        let filterExample = filterFormToDataResource(filter);
        let headers = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (filterExample) {
            headers["Content-Type"] = "application/json";
            return await myFetch(`${repoBaseUrl}/api/v1/dataresources/search?page=${realPage}&size=${size}&sort=lastUpdate,desc`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(filterExample)
            }).then((res) => res.json());
        }

        return await myFetch(`${repoBaseUrl}/api/v1/dataresources/?page=${realPage}&size=${size}&sort=lastUpdate,desc`, {headers: headers}).then(res => res.json());
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export async function loadContent(resource: DataResource, token?: string | undefined): Promise<ContentInformation[]> {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/vnd.datamanager.content-information+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${repoBaseUrl}/api/v1/dataresources/${resource.id}/data/`,
            {headers: headers}).then(res => res.json()).catch(error => {
            throw error
        });
    } catch (error) {
        console.error('Service Error:', error);
        return [];
    }
}

export async function updateThumbState(id: string, path: string, addRemove: boolean, token?: string | undefined) {
    let headers = {"Accept": "application/patch+json"};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (addRemove) {
        console.log("Add thumb state ", id, "/data/", path);
    } else {
        console.log("Remove thumb state ", id, "/data/", path);
    }
}


export async function fetchDataResourcePages(size: number, filter?: FilterForm, token?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let fetchPromise: Promise<any>;
        let filterExample = filterFormToDataResource(filter);

        let headers = {"Accept": "application/json", "Content-Type": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        if (filterExample) {
            fetchPromise = myFetch(`${repoBaseUrl}/api/v1/dataresources/search?page=0&size=0`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(filterExample)
            });
        } else {
            fetchPromise = myFetch(`${repoBaseUrl}/api/v1/dataresources/?page=0&size=0`, {headers: headers});
        }

        return await fetchPromise.then(response => response.headers.get("Content-Range")).then(rangeHeader => rangeHeader.substring(rangeHeader.lastIndexOf("/") + 1)).then((totalElements) => Math.ceil(totalElements / size));
    } catch (error) {
        console.error('Failed to fetch resource page count. Error:', error);
        return undefined;
    }
}

export async function fetchDataResource(id: string, token?:string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return myFetch(`${repoBaseUrl}/api/v1/dataresources/${id}`,
            {headers: headers}).then(res => res.json());
    } catch (error) {
        console.error('Failed to fetch resource. Error:', error);
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

export async function fetchActuatorHealth(token?:string | undefined) {
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
