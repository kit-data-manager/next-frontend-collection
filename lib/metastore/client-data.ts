import {DataResource, DataResourcePage} from "@/lib/definitions";


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

export async function updateMetadataSchema(resource: DataResource, etag: string, accessToken?: string | undefined): Promise<number> {
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

export class ResponseError extends Error {
    public response: string;

    constructor(message, res) {
        super(message);
        this.response = res;
    }
}


