import {ExtendedSession} from "@/lib/definitions";
import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

async function createResource(accessToken:string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const body =  req.body;

    console.log("BOD ",  req.body);

    await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to create resource.'});
            Promise.reject( 'Failed to create resource.');
        }
        return response.json();
    }).then(json => res.status(201).json(json));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }

    const session:ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken:string | undefined = session?.accessToken;

    try {
       //create resource
       await createResource(accessToken, req, res);
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
