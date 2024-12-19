import {NextApiRequest, NextApiResponse} from "next";
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import fetch from "node-fetch";

async function getResource(resourceId: string, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const headers = {
        "Accept": "application/json"
    };
    let url: string = `${repoBaseUrl}/api/v1/dataresources/${resourceId}`;

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to get resource.'});
            Promise.reject('Failed to get resource.');
        } else {
            //transfer headers
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            res.writeHead(200, headers);
            return response.json();
        }
    }).then(json => res.end(JSON.stringify(json)));
}

async function getContent(resourceId: string, filename: string, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const headers = {
        "Accept": "application/vnd.datamanager.content-information+json"
    };
    let url: string = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to get content metadata.'});
            Promise.reject('Failed to get content metadata.');
        }

        //transfer headers
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        res.writeHead(200, headers);
        return response.json();
    }).then(json => res.end(JSON.stringify(json)));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {
        const {resourceId, filename} = req.query;
        if (!filename) {
            //list resources
            await getResource(resourceId as string, accessToken, req, res);
        } else {
            await getContent(resourceId as string, filename as string, accessToken, req, res);
        }
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
