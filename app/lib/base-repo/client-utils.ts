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
                toast.info("Thumb tag successfully removed from " + element.relativePath + ".", {
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

export function updateDataResource(resource:JSON, etag:string, router?:AppRouterInstance, redirectPath?:string){
    const fetcher = (url:string) => fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
            "If-Match": etag
        },
        body: JSON.stringify(resource)
    }).then(function(response){
        return response.status
    }).then((status) => {
        if(status == 200) {
            toast.info("Resource successfully updated.", {
                "onClose": () => {
                    if (router && redirectPath) {
                        router.push('/base-repo/resources');
                        router.refresh();
                    }
                }
            });
        }else{
            toast.error("Failed to update resource. Status: " + status);
        }
    })

    return fetcher("http://localhost:8081/api/v1/dataresources/" + resource["id"]);
}

export function deleteContent(element:ContentInformation, redirectPath?:string){
    const fetcher = (url:string) => fetch(url,
        {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(response => {
        return response.headers.get("ETag");
    }).then( etag => {
        return fetch(url, {
            method: "DELETE",
            headers: {
                "If-Match": etag
            },
        }).then(function(response){
            return response.status;
        });
    }).then(status => {
        if(status == 204) {
            toast.info("Content " + element.relativePath + " successfully removed.",{
                "onClose": () =>{
                    if(redirectPath) {
                        window.document.location = redirectPath;
                    }
                }
            });
        }else{
            toast.error("Failed to remove content. Status: " + status);
        }
    });

    fetcher(`http://localhost:8081/api/v1/dataresources/${element.parentResource.id}/data/${element.relativePath}`);
}
