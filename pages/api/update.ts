import {ExtendedSession} from "@/lib/definitions";
import {getSession} from "next-auth/react";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }

    const session:ExtendedSession = await getSession({req}) as ExtendedSession;
    const accessToken:string | undefined = session?.accessToken;

    try {
        const {resourceId, etag} = req.query;
        const body = req.body
        if(!resourceId){
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

        await fetch(url, {
            method: "PUT",
            headers: headers,
            body: body
        }).then(response => {
            return response.status
        });

    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}