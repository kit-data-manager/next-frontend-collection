import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import stream from 'stream';
import {promisify} from 'util';
import {ContentInformation} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {ExtendedSession} from "@/lib/next-auth/next-auth";

async function downloadData(resourceId:string, filename:string, accessToken:string | undefined, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;
    let realFilename = filename as string;
    if (realFilename.indexOf("/")) {
        realFilename = realFilename.substring(realFilename.lastIndexOf("/") + 1)
    }
    const headers = {"Accept": "application/vnd.datamanager.content-information+json"};

    if(accessToken){
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
            res.setHeader('Content-Type', (json as ContentInformation).mediaType);
            res.setHeader('Content-Length', (json as ContentInformation).size);
            res.setHeader('Content-Disposition', `attachment; filename=${realFilename}`);
            headers["Accept"] = (json as ContentInformation).mediaType;
        }).then(() => {
            return fetch(url, {headers: headers} ).then(response => {
                //Pipe the file data
                //@ts-ignore
                return pipeline(response.body, res);
            });
        }).then(() => res.status(200));
}

async function downloadThumb(resourceId:string, filename:string, accessToken:string | undefined, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;

    const headers = {"Accept": "application/vnd.datamanager.content-information+json"};

    if(accessToken){
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const contentInfo = await fetch(url, {headers: headers})
        .then(response => {
            if (!response.ok) {
                res.status(404).json({message: 'Not found'});
                Promise.reject("Not found");
            }

            return response.json();
        }).then(json => {
            return (json as ContentInformation);
        });

    headers["Accept"] = contentInfo.mediaType;
    const image = await fetch(url, {headers: headers})

    const blob = await image.blob();
    const reader = blob.stream().getReader();
    const chunks: any[] = [];

    for( ;; ) {
        const { done, value } = await reader.read()
        if( done ){
            break;
        }
        value.map(elem => chunks.push(elem));
    }

    res.setHeader(
        "Content-Type",
        image.headers.get("content-type") || "image/*"
    );

    res.setHeader(
        "Content-Length",
        image.headers.get("content-length") || contentInfo.size
    );
    res.setHeader("Content-Disposition", `attachment; filename="${contentInfo.relativePath}"`);

    res.write(Uint8Array.from(chunks));
    res.status(200).end();
}

async function downloadZip(resourceId:string, accessToken:string | undefined, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';

    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/`;

    const headers = {"Accept": "application/zip"};

    if(accessToken){
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const pipeline = promisify(stream.pipeline);

    await fetch(url, {headers: headers})
        .then(response => {
            res.setHeader('Content-Type', "application/zip");
            res.setHeader('Content-Disposition', `attachment; filename=${resourceId}.zip`);
            //Pipe the file data
            //@ts-ignore
            return pipeline(response.body, res);
        }).then(() => { res.status(200).end()});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session:ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken:string | undefined = session?.accessToken;

    try {
        const {resourceId, filename, type} = req.query as {resourceId:string, filename:string, type:string};
        if(!resourceId ){
            res.status(500).json({message: 'resourceId not provided.'})
            return
        }
        switch (type) {
            case "data":  await downloadData(resourceId, filename, accessToken, res);break;
            case "thumb": await  downloadThumb(resourceId, filename, accessToken, res);break;
            case "zip": await  downloadZip(resourceId, accessToken, res);break;
            default:res.status(500).json({message: `Unsupported download type ${type} != [data, thumb, zip].`})
        }

    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}


