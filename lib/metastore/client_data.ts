import {Acl, DataResource, DataResourcePage} from "@/lib/definitions";
import {fetchWithBasePath} from "@/lib/utils";

export async function fetchMetadataSchemas(page: number, size: number, sort?: string): Promise<DataResourcePage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let sorting = sort;
        if (!sorting) {
            sorting = "lastUpdate,desc";
        }
        return await fetchWithBasePath(`/api/metastore/list?page=${realPage}&size=${size}&sort=${sorting}`).then(async (res) => {
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
        return Promise.reject("No resources found");
    }
}

export async function fetchMetadataSchema(id: string, token?: string | undefined): Promise<DataResource> {
    try {
        return fetchWithBasePath(`/api/metastore/get?resourceId=${id}&type=schemaRecord`).then(res => {
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
        console.error('Failed to fetch schema. Error:', error);
        return Promise.reject("No schema found");
    }
}

export async function fetchMetadataSchemaDocument(id: string, token?: string | undefined): Promise<string> {
    try {
        return fetchWithBasePath(`/api/metastore/get?resourceId=${id}&type=schemaDocument`).then(res => {
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


export async function fetchMetadataSchemaEtag(id: string, token?: string | undefined) {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040";
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await fetch(`${metastoreBaseUrl}/api/v2/schemas/${id}`,
            {
                method:"GET",
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

export async function myFetch(url: string, init?: any, onlyExpectBody: boolean = false) {
    let res: Response = await fetch(url, init);
    if (!res.ok && !onlyExpectBody) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}

export async function updateMetadataSchema(resource: DataResource, etag:string, accessToken?: string|undefined) {
    const headers = {
        "Content-Type": "application/json",
        "If-Match": etag
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040";

    const response = await fetch(`${metastoreBaseUrl}/api/v2/schemas/${resource['id']}}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(resource)
    });

    if (response.status === 200) {
        return response.status;
    } else {
        throw new ResponseError('Failed to update metadata schema.', response);
    }


    /* const response = await fetchWithBasePath(`/api/metastore/update?resourceId=${resource["id"]}&etag=${resource.etag}&type=schema`, {
        method: "PUT",
        body: JSON.stringify(resource)
    });

    if (response.status === 200) {
        return response.status;
    } else {
        throw new ResponseError('Failed to update resource.', response);
    }*/
}
