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
    const {resourceId, path, tag} = req.query;

    if(!resourceId || !path || !tag){
        res.status(500).json({message: 'resourceId, path or tag not provided.'})
        return
    }

    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
        const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${path}`;

        const headers = {
            "Accept": "application/vnd.datamanager.content-information+json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        let body;

        const status = await fetch(url,
            {headers: headers}).then(response => {
                //get body, check if tag is there, create patch accordingly
            const etag = response.headers.get("ETag");
            headers["If-Match"] = etag ? etag : ""
            return response.json();
        }).then(content => {
            let index = content.tags? content.tags.indexOf(tag) : -1;
            if(index > -1) {
                body = [{"op": "remove", "path": `/tags/${index}`}]
            }else{
                body = [{"op": "add", "path": `/tags/0`, "value": tag}]
            }
        }).then(async () => {
            headers["Accept"] = "";
            headers["Content-Type"] = "application/json-patch+json";
            return await fetch(url, {
                method: "PATCH",
                headers: headers,
                body: JSON.stringify(body)
            });
        }).then(response => response.status);

        res.status(status).end();
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }

}
