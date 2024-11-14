import {ExtendedSession} from "@/lib/definitions";
import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import { Formidable } from "formidable";
import {Writable} from "node:stream";

//promise api route config
export const config = {
    api: {
        bodyParser: false,
    },
};

//promise helper
function formidablePromise(
    req: NextApiRequest,
    opts?: Parameters<typeof Formidable>[0]
): Promise<{fields: Formidable.Fields; files: Formidable.Files}> {
    return new Promise((accept, reject) => {
        const form = new Formidable(opts);

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            return accept({fields, files});
        });
    });
}

//formidable config
const formidableConfig = {
    keepExtensions: true,
    maxFileSize: 10_000_000,
    maxFieldsSize: 10_000_000,
    maxFields: 7,
    allowEmptyFiles: false,
    multiples: false,
};

//file consumer for formidable
const fileConsumer = <T = unknown>(acc: T[]) => {
    return new Writable({
        write: (chunk, _enc, next) => {
            acc.push(chunk);
            next();
        }
    });
};

async function uploadFile(resourceId: string, filename: string, accessToken:string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;

    const headers = {
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const chunks: never[] = [];

    //load file
    await formidablePromise(req, {
        ...formidableConfig,
        // consume this, otherwise formidable tries to save the file to disk
        fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    //concat received chunks
    const fileData = Buffer.concat(chunks);

    //create form data
    const formData = new FormData();
    formData.append('file', new Blob([fileData]));

    //submit
    await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData
    }).then(response => {
        if (response.status != 201) {
            res.status(response.status).json({message: `Failed to upload file ${filename}.`});
            Promise.reject(`Failed to upload file ${filename}.`);
        }
        res.status(201).end();
    }).then(json => res.status(201).json(json));
}

async function createResource(accessToken:string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/`;

    const headers = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const body = req.body;

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
        const {resourceId, filename} = req.query as {resourceId:string, filename:string};

        console.log(" RES ", resourceId);
        console.log(" filename ", filename);
        if(!resourceId){
            //create resource
            await createResource(accessToken, req, res);
        }else if(resourceId && filename){
            //upload file
            await uploadFile(resourceId, filename, accessToken, req, res);
        }else{
            //invalid request
            res.status(400).json({message: 'Endpoint must be either called with resourceId and body, or with resourceId, filename and body.'})
            return
        }

    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
