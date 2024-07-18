'use client'

import {ContentInformation, DataResource} from "@/app/lib/definitions";
import {toast} from "react-toastify";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export function removeTagFromContent(element:ContentInformation, tag:string, redirectPath?:string){
    let index = element.tags.indexOf(tag);
    if(index >= 0){
        const patch = [{"op": "remove", "path": `/tags/${index}`}]

        const fetcher = (url:string) => fetch(url,
            {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(response => {
            return response.headers.get("ETag");
        }).then( etag => {
            return fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json-patch+json",
                    "If-Match": etag
                },
                body: JSON.stringify(patch)
            }).then(function(response){
                return response.status;
            });
        }).then(status => {
            if(status == 204) {
                toast.success("Thumb tag successfully removed from " + element.relativePath + ".", {
                    "onClose": () => {
                        if(redirectPath) {
                            //reload page after 3 seconds wait
                            window.document.location = redirectPath;
                        }
                    }
                });
            }else{
                toast.error("Failed to update resource. Status: " + status);
            }
        });
        fetcher(`http://localhost:8081/api/v1/dataresources/${element.parentResource.id}/data/${element.relativePath}`);
    }
}

export function assignTagToContent(element:ContentInformation, tag:string, redirectPath?:string){
    const patch = [{"op": "add","path": `/tags/0`, "value": tag}]

    const fetcher = (url:string) => fetch(url,
        {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(response => {
        return response.headers.get("ETag");
    }).then( etag => {
        return fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json-patch+json",
                "If-Match": etag
            },
            body: JSON.stringify(patch)
        }).then(function(response){
            return response.status;
        }).then(status => {
            if(status == 204) {
                toast.info("Thumb tag successfully assigned to " + element.relativePath + ".", {
                    "onClose": () => {
                        if(redirectPath) {
                                //reload page after 3 seconds wait
                                window.document.location = redirectPath;
                        }
                    }
                });
            }else{
                toast.error("Failed to update resource. Status: " + status);
            }
        })
    });

    fetcher(`http://localhost:8081/api/v1/dataresources/${element.parentResource.id}/data/${element.relativePath}`);
}

export function updateDataResource(resource:object, etag:string){
    const fetcher = (url:string) => fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
            "If-Match": etag
        },
        body: JSON.stringify(resource)
    }).then(response => {
        return response.status
    });

    return fetcher("http://localhost:8081/api/v1/dataresources/" + resource["id"]);
}

export function createDataResource(resource:object){
    const fetcher = (url:string) => fetch(url, {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(resource)
    });

    return fetcher("http://localhost:8081/api/v1/dataresources/");
}

export function deleteContent(element:ContentInformation, redirectPath?:string){
    return fetch(`http://localhost:3000/api/delete?resourceId=${element.parentResource.id}&filename=${element.relativePath}`).then(response => {
      return response.status;
    })
}
