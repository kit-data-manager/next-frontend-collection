import {Acl, DataResource, DataResourcePage} from "@/lib/definitions";
import {fetchWithBasePath} from "@/lib/utils";


export async function createMetadataSchema(resource: DataResource, accessToken?: string | undefined) {
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

export async function fetchMetadataSchemas(page: number, size: number, sort?: string, accessToken?: string | undefined): Promise<DataResourcePage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let sorting = sort;
        if (!sorting) {
            sorting = "lastUpdate,desc";
        }
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
        const headers = {
            "Accept": "application/vnd.datacite.org+json"
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return await fetch(`${metastoreBaseUrl}/api/v2/schemas/?page=${realPage}&size=${size}&sort=${sorting}`,
            {
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
    } catch (error) {
        console.error('Service Error:', error);
        return Promise.reject("No schemas found");
    }
}

export async function fetchMetadataSchema(id: string, accessToken?: string | undefined): Promise<DataResource> {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
        const headers = {
            "Accept": "application/vnd.datacite.org+json"
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return fetch(`${metastoreBaseUrl}/api/v2/schemas/${id}`, {
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
        console.error('Failed to fetch schema record. Error:', error);
        return Promise.reject("No schema record found");
    }
}

export async function fetchMetadataSchemaDocument(id: string, mimeType: string, accessToken?: string | undefined): Promise<string> {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
        const headers = {
            "Accept": mimeType
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return fetch(`${metastoreBaseUrl}/api/v2/schemas/${id}`, {
            method: "GET",
            headers: headers
        }).then(res => {
            return res.text();
        })
    } catch (error) {
        console.error('Failed to fetch schema. Error:', error);
        return Promise.reject("No schema found");
    }
}

/*
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
        return fetchWithBasePath(`/api/metastore/patch?resourceId=${id}&etag=${etag}`, {
            method: "PATCH",
            body: JSON.stringify(patch)
        }).then(res => res.status);
    } catch (error) {
        console.error('Failed to patch resource. Error:', error);
        return Promise.reject("Failed to patch resource.");
    }
}*/

export async function fetchMetadataSchemaEtag(id: string, accessToken?: string | undefined) {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040";
        let headers = {
            "Accept": "application/vnd.datacite.org+json"
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return await fetch(`${metastoreBaseUrl}/api/v2/schemas/${id}`,
            {
                method: "GET",
                headers: headers
            }).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch schema ETag. Error:', error);
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

export async function updateMetadataSchema(resource: DataResource, etag: string, accessToken?: string | undefined): Promise<number> {
    console.log("ET ", etag);
    const headers = {
        "If-Match": etag
    };

    let formData = new FormData();
    formData.append('record', new Blob([JSON.stringify(resource)], {
        type: "application/vnd.datacite.org+json"
    }));

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040";
console.log("TARGET ", `${metastoreBaseUrl}/api/v2/schemas/${resource.id}`);
console.log("HEADERS ", headers);
    return await fetch(`${metastoreBaseUrl}/api/v2/schemas/${resource.id}`, {
        method: "PUT",
        headers: headers,
        body: formData
    }).then((response) => {
        if (response.status === 200) {
            return response.status;
        } else {
            throw new ResponseError('Response not HTTP 200.', response);
        }
    });
}
