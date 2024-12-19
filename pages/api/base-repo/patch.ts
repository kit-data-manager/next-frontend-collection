import {NextApiRequest, NextApiResponse} from "next";
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

async function patchResource(resourceId: string, etag:string, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse){
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}`;
        const body = req.body

        const headers = {
            "If-Match": etag,
            "Content-Type": "application/json-patch+json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const status = await  fetch(url, {
                method: "PATCH",
                headers: headers,
                body: body
            }).then(response => response.status);

        res.status(status).end();
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}

async function patchContent(resourceId: string, path:string, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse){
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${path}`;
        const body = req.body

        const headers = {
            "Accept": "application/vnd.datamanager.content-information+json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const status = await fetch(url,
            {headers: headers}).then(response => {
            return response.headers.get("ETag");
        }).then(async etag => {
            headers["Accept"] = "";
            headers["Content-Type"] = "application/json-patch+json";
            headers["If-Match"] = etag ? etag : ""
            return await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: body
            });
        }).then(response => response.status);

        res.status(status).end();
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PATCH') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session:ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken:string | undefined = session?.accessToken;
    const {resourceId, path, etag} = req.query;

    if(!resourceId){
        res.status(500).json({message: 'resourceId not provided.'})
        return
    }

    if(!path){
        await patchResource(resourceId as string, etag as string, accessToken, req, res);
    }else{
        await patchContent(resourceId as string, path as string, accessToken, req, res);
    }


}
