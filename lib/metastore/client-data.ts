import {DataResource, DataResourcePage} from "@/lib/definitions";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {MetadataFilterForm} from "@/app/metastore/components/MetadataFilterForm/MetadataFilterForm.d";

/**
 * Fetch a list of metadata records. This function applies to schema and document records, the accessed endpoint is determined by the 'type' argument.
 * In addition, the functions can be parameterized for pagination, sorting, and support providing a JWT accessToken for authenticated requests.
 *
 * @param {("schema" | "document")} type  - The type of records to return, i.e., "schema" or "document"
 * @param {number} page - The page number to return.
 * @param {number} size - the page size, i.e., the max number of elements per page.
 * @param {filter} filter - The filter for results.
 * @param {string} [sort] - The optional sort order in the form 'fieldName,direction', e.g., lastUpdate,desc, which is also the default.
 * @param {string} [accessToken] - An optional bearer token for authorization.
 */
export async function fetchMetadataRecords(type: "schema" | "document", page: number, size: number, filter?: MetadataFilterForm, sort?: string, accessToken?: string | undefined): Promise<DataResourcePage> {
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

        let endpoint:string= '';
        if(filter?.schemaId == undefined){
            endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/?
            page=${realPage}
            &size=${size}
            &sort=${sorting}`;
        }else{
            endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/?
            page=${realPage}
            &schemaId=${filter?.schemaId}
            &size=${size}
            &sort=${sorting}`;
        }

       return await fetch(endpoint,
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
        return Promise.reject("Failed to fetch metadata records.");
    }
}


/**
 * Fetch a single metadata records. This function applies to schema and document records, the accessed endpoint is determined by the 'type' argument.
 * The record to return is identified via the provided 'id' argument and providing a JWT accessToken for authenticated requests is supported. In comparison
 * to records returned via fetchMetadataRecords, the record returned will also contain the current eTag of the resource, which is required for update
 * operations.
 *
 * @param {("schema" | "document")} type  - The type of records to return, i.e., "schema" or "document"
 * @param {string} id - The id of the record to return, i.e., schemaId or metadataDocumentId.
 * @param {string} [accessToken] - An optional bearer token for authorization.
 */
export async function fetchMetadataRecord(type: "schema" | "document", id: string, accessToken?: string | undefined): Promise<DataResource> {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
        const headers = {
            "Accept": "application/vnd.datacite.org+json"
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/${id}`;

        return fetch(endpoint, {
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
        console.error('Failed to fetch metadata document. Error:', error);
        return Promise.reject("Failed to fetch metadata document.");
    }
}

/**
 * Fetches a metadata document (schema or metadata) from the metastore service.
 *
 * This function makes a GET request to the metastore API to retrieve a metadata document
 * identified by the provided `id` and `type`. It returns documents either in JSON or XML format
 * as specified by the `mimeType`, depending on the actual document type which must be known in advance.
 * If an `accessToken` is provided, it will be included in the request headers
 * for authorization. The function returns the response text (either JSON or XML depending on the `mimeType`).
 *
 * @param {("schema" | "document")} type - The type of document to fetch. Can be either "schema" or "document".
 * @param {string} id - The unique identifier for the schema or metadata document.
 * @param {("application/json" | "application/xml")} mimeType - The desired MIME type for the document response.
 * @param {string} [accessToken] - An optional bearer token for authorization.
 *
 * @returns {Promise<string>} A promise that resolves to the document content as a string (JSON or XML).
 *
 * @throws {Error} If the fetch operation fails or an error occurs in the try block, an error message is logged,
 *                 and the function rejects the promise with "No schema found".
 */
export async function fetchMetadataDocument(type: "schema" | "document", id: string, mimeType: "application/json" | "application/xml", accessToken?: string | undefined): Promise<string> {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
        const headers = {
            "Accept": mimeType
        };
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/${id}`;

        return fetch(endpoint, {
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

/**
 * Fetches the ETag header for a metadata schema from the metastore service.
 *
 * This function makes a GET request to the metastore API to retrieve metadata schema or document record details
 * depending on the provided `type` and identified by the provided `id`. It returns the value of the `ETag` header from the response,
 * which is typically used for cache validation purposes.
 * If an `accessToken` is provided, it will be included in the request headers for authentication.
 *
 * @param {("schema" | "document")} type  - The type of records to return, i.e., "schema" or "document"
 * @param {string} id - The unique identifier for the metadata schema.
 * @param {string} [accessToken] - An optional bearer token for authorization.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the `ETag` string from the response headers
 *                                      or `undefined` if an error occurs.
 *
 * @throws {Error} If the fetch operation fails or an error occurs in the try block, an error is logged to the console.
 */
export async function fetchMetadataEtag(type: "schema" | "document", id: string, accessToken?: string | undefined) {
    try {
        const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040";
        let headers = {
            "Accept": "application/vnd.datacite.org+json"
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        const endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/${id}`;

        return await fetch(endpoint,
            {
                method: "GET",
                headers: headers
            }).then(result => result.headers.get("ETag"));
    } catch (error) {
        console.error('Failed to fetch ETag header. Error:', error);
        return undefined;
    }
}

/**
 * Updates a metadata schema or document record in the metastore service.
 *
 * This function sends a PUT request to the metastore API to update an existing metadata schema or document
 * record identified by the provided `type` and `resource.id`. It includes the provided `etag` in the `If-Match` header
 * to ensure conditional updates (only if the ETag matches). The request body contains the `resource` data serialized as JSON.
 * If an `accessToken` is provided, it will be included in the request headers for authorization.
 *
 * @param {("schema" | "document")} type - The type of resource to update. Can be either "schema" or "document".
 * @param {DataResource} resource - The resource object containing the metadata schema or document details to update.
 * @param {string} etag - The ETag value to ensure a conditional update of the resource.
 * @param {string} [accessToken] - An optional bearer token for authorization.
 *
 * @returns {Promise<number>} A promise that resolves to the HTTP status code (200 if successful).
 *
 * @throws {ResponseError} If the response status is not HTTP 200, a `ResponseError` is thrown.
 */
export async function updateMetadataRecord(type: "schema" | "document", resource: DataResource, etag: string, accessToken?: string | undefined): Promise<number> {
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

    const endpoint = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/${resource.id}`;


    return await fetch(endpoint, {
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


