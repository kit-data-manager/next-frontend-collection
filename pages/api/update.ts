import {ExtendedSession} from "@/lib/definitions";
import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {
        const {resourceId, etag} = req.query;
        const body = req.body
        if (!resourceId) {
            res.status(500).json({message: 'resourceId not provided.'})
            return
        }

        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}`;

        const headers = {
            "Content-Type": "application/json",
            "If-Match": etag ? etag as string : ""
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const status = await fetch(url, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(body)
        }).then(response => response.status);

        res.status(status).end();
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
