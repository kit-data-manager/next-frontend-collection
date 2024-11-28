'use client'

import {ContentInformation} from "@/lib/definitions";
import {ResponseError} from "@/lib/base-repo/client_data";
import {fetchWithBasePath} from "@/lib/utils";

/*export async function removeTagFromContent(element: ContentInformation, tag: string) {
    let index = element.tags.indexOf(tag);
    if (index >= 0) {
        const patch = [{"op": "remove", "path": `/tags/${index}`}]
        const headers = {
            "Content-Type": "application/json-patch+json",
            //"If-Match": etag
        };
        const response = await fetchWithBasePath(`/api/patch?resourceId=${element.parentResource.id}&path=${element.relativePath}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(patch)
        });

        if (response.status === 204) {
            return response.status;
        } else {
            throw new ResponseError('Failed to remove tag.', response);
        }
    }
}

export async function assignTagToContent(element: ContentInformation, tag: string) {
    const patch = [{"op": "add", "path": `/tags/0`, "value": tag}]
    const headers = {
        "Content-Type": "application/json-patch+json",
        //"If-Match": etag
    };
    const response = await fetchWithBasePath(`/api/patch?resourceId=${element.parentResource.id}&path=${element.relativePath}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(patch)
    });

    if (response.status === 204) {
        return response.status;
    } else {
        throw new ResponseError('Failed to assign tag.', response);
    }
}*/

export async function updateDataResource(resource: object, etag: string) {
    const headers = {
        "Content-Type": "application/json",
        "If-Match": etag
    };

    const response = await fetchWithBasePath(`/api/update?resourceId=${resource["id"]}&etag=${etag}`, {
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

export async function createDataResource(resource: object) {
    const headers = {
        "Content-Type": "application/json"
    };
    const response = await fetchWithBasePath(`/api/create`, {
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

/*export async function deleteContent(element: ContentInformation) {
    const response = await fetchWithBasePath(`/api/delete?resourceId=${element.parentResource.id}&filename=${element.relativePath}`);

    if (response.status === 204) {
        return response.status;
    } else {
        throw new ResponseError('Failed to delete content.', response);
    }
}*/
