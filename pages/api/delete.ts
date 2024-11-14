import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {ExtendedSession} from "@/lib/definitions";
import {getSession} from "next-auth/react";

async function deleteContent(resourceId: string, filename: string, accessToken: string, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;

    const headers = {
        "Accept": "application/vnd.datamanager.content-information+json"
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    await fetch(url, {
        method: "GET",
        headers: headers
    })
        .then(response => {
            if (response.status === 404) {
                res.status(404).json({message: 'Not found'});
                Promise.reject("Not found");
            } else if (response.status === 401 || response.status === 403) {
                res.status(response.status).json({message: 'Forbidden'});
                Promise.reject("Forbidden");
            }
            return response.headers.get("ETag");
        }).then(etag => {
            headers["If-Match"] = etag ? etag : "";
            return fetch(url, {
                method: "DELETE",
                headers: headers
            }).then(function (response) {
                return response.status;
            });
        }).then(status => {
            if (status != 204) {
                res.status(status).json({message: 'Failed to delete.'});
                Promise.reject("Failed");
            } else {
                res.status(204).end();
                Promise.resolve();
            }
        });
}

async function deleteResource(resourceId: string, etag: string, type: string, accessToken: string, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}`;

    const headers = {};
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (type === "revoke") {
        const patch = [{"op": "replace", "path": `/state`, "value": "REVOKED"}]

        headers["If-Match"] = etag ? etag : "";
        headers["Content-Type"] = "application/json-patch+json";
        await fetch(url, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(patch)
        }).then(response => response.status).then(status => {
            if (status != 204) {
                res.status(status).json({message: 'Failed to delete.'});
                Promise.reject("Failed");
            } else {
                res.status(204).end();
                Promise.resolve();
            }
        })

    } else if (type === "delete") {
        headers["If-Match"] = etag ? etag : "";
        await fetch(url, {
            method: "DELETE",
            headers: headers
        }).then(response => response.status).then(status => {
            if (status != 204) {
                res.status(status).json({message: 'Failed to delete.'});
                Promise.reject("Failed");
            } else {
                res.status(204).end();
                Promise.resolve();
            }
        })
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }

    const session: ExtendedSession = await getSession({req}) as ExtendedSession;
    const accessToken: string | undefined = session?.accessToken;

    try {
        const {resourceId, filename, etag, type} = req.query;
        if (!resourceId) {
            res.status(500).json({message: 'resourceId not provided.'})
            return
        }

        if (filename) {
            //deleteContent
            await deleteContent(resourceId as string, filename as string, accessToken, res);
        } else {
            //revoke/delete resource
            if (!etag || !type) {
                res.status(500).json({message: 'etag and/or type not provided.'})
                return
            }
            await deleteResource(resourceId as string, etag as string, type as string, accessToken, res);
        }

    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}

