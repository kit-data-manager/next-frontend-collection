import {NextApiRequest, NextApiResponse} from "next";
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PATCH') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session:ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken:string | undefined = session?.accessToken;
    const {resourceId, path} = req.query;

    if(!resourceId || !path){
        res.status(500).json({message: 'resourceId or path not provided.'})
        return
    }

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
