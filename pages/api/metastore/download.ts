import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import stream from 'stream';
import {promisify} from 'util';
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

async function downloadMetadata(resourceId: string, type: string, format: string, accessToken: string | undefined, res: NextApiResponse) {
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';

    const url = `${metastoreBaseUrl}/api/v2/${type === "schema" ? "schemas" : "metadata"}/${resourceId}`;

    const headers = {"Accept": format === "json" ? "application/json" : "application.xml"};

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const pipeline = promisify(stream.pipeline);

    await fetch(url, {headers: headers})
        .then(response => {
            if (!response.ok) {
                res.status(404).json({message: 'Not found'});
                Promise.reject("Not found");
            }

            return response.json();
        }).then(json => {
            const filename = `metadata.${format === "json" ? "json" : "xml"}`;
            res.setHeader('Content-Type', headers['Accept']);
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        }).then(() => {
            return fetch(url, {headers: headers}).then(response => {
                //Pipe the file data
                //@ts-ignore
                return pipeline(response.body, res);
            });
        }).then(() => res.status(200));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {
        const {resourceId, type, format} = req.query as { resourceId: string, type: string, format: string };
        if (!resourceId || !type || !format) {
            res.status(500).json({message: 'resourceId, type, or format not provided.'})
            return
        }

        await downloadMetadata(resourceId, type, format, accessToken, res);
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}


