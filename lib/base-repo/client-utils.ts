'use client'

import {ContentInformation} from "@/lib/definitions";
import {toast} from "react-toastify";

export function removeTagFromContent(element: ContentInformation, tag: string, redirectPath?: string, token?:string) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    let index = element.tags.indexOf(tag);
    if (index >= 0) {
        const headers = {
            "Accept": "application/vnd.datamanager.content-information+json",
        };

        if(token){
            headers["Authorization"] = `Bearer ${token}`;
        }

        const patch = [{"op": "remove", "path": `/tags/${index}`}]

        const fetcher = (url: string) => fetch(url,
            {headers: headers}).then(response => {
            return response.headers.get("ETag");
        }).then(etag => {
            headers["Accept"] = "";
            headers["Content-Type"] = "application/json-patch+json";
            headers["If-Match"] = etag ? etag : ""

            return fetch(url, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(patch)
            }).then(function (response) {
                return response.status;
            });
        }).then(status => {
            if (status == 204) {
                toast.success("Thumb tag successfully removed from " + element.relativePath + ".", {
                    "onClose": () => {
                        if (redirectPath) {
                            //reload page after 3 seconds wait
                            window.document.location = redirectPath;
                        }
                    }
                });
            } else {
                toast.error("Failed to update resource. Status: " + status);
            }
        });
        fetcher(`${repoBaseUrl}/api/v1/dataresources/${element.parentResource.id}/data/${element.relativePath}`);
    }
}

export function assignTagToContent(element: ContentInformation, tag: string, redirectPath?: string | null, token?:string) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const patch = [{"op": "add", "path": `/tags/0`, "value": tag}]

    const headers = {
        "Accept": "application/vnd.datamanager.content-information+json",
    };

    if(token){
        headers["Authorization"] = `Bearer ${token}`;
    }

    const fetcher = (url: string) => fetch(url,
        {headers: headers}).then(response => {
        return response.headers.get("ETag");
    }).then(etag => {
        headers["Accept"] = "";
        headers["Content-Type"] = "application/json-patch+json";
        headers["If-Match"] = etag ? etag : ""

        return fetch(url, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(patch)
        }).then(function (response) {
            return response.status;
        }).then(status => {
            if (status == 204) {
                toast.info("Thumb tag successfully assigned to " + element.relativePath + ".", {
                    "onClose": () => {
                        if (redirectPath) {
                            //reload page after 3 seconds wait
                            window.document.location = redirectPath;
                        }
                    }
                });
            } else {
                toast.error("Failed to update resource. Status: " + status);
            }
        })
    });

    fetcher(`${repoBaseUrl}/api/v1/dataresources/${element.parentResource.id}/data/${element.relativePath}`);
}

export function updateDataResource(resource: object, etag: string, token?: string) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const headers = {
        "Content-Type": "application/json",
        "If-Match": etag
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const fetcher = (url: string) => fetch(url, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(resource)
    }).then(response => {
        return response.status
    });

  //  return fetcher(`${repoBaseUrl}/api/v1/dataresources/` + resource["id"]);
    return fetcher(`/api/update?resourceId=${resource["id"]}&etag=${etag}`);
}

export function createDataResource(resource: object, token?: string) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const fetcher = (url: string) => fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(resource)
    });

    return fetcher(`${repoBaseUrl}/api/v1/dataresources/`);
}

export function deleteContent(element: ContentInformation, redirectPath?: string, token?: string) {
    const headers = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`/api/delete?resourceId=${element.parentResource.id}&filename=${element.relativePath}`,
        {
            headers: headers
        }).then(response => response.status);
}
