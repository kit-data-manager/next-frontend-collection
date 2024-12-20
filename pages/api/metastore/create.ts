import {ExtendedSession} from "@/lib/definitions";
import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Formidable} from "formidable";
import {PassThrough, Writable} from "node:stream";

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
): Promise<{ fields: Formidable.Fields; files: Formidable.Files }> {
    return new Promise((accept, reject) => {
        const form = new Formidable(opts);

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            console.log("fields ", files);
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
    multiples: true,
};

//file consumer for formidable
const fileConsumer = <T = unknown>(acc1: T[], acc2: T[]) => {
    const acc = (acc1.length == 0) ? acc1 : acc2;
    return new Writable({
        write: (chunk, _enc, next) => {
            acc.push(chunk);
            next();
        }
    });
};


async function createResource(formData:FormData, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
    const url = `${metastoreBaseUrl}/api/v2/schemas/`;

    const headers = {
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }


    await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to create schema.'});
            Promise.reject('Failed to create schema.');
        }
        return response.json();
    }).then(json => res.status(201).json(json));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }

    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {

        const chunks1: never[] = [];
        const chunks2: never[] = [];

        //load file
        const keys: string[] = await formidablePromise(req, {
            ...formidableConfig,
            // consume this, otherwise formidable tries to save the file to disk
            fileWriteStreamHandler: () => fileConsumer(chunks1, chunks2),
            // fileWriteStreamHandler: () => streamHandler
        }).then((res) => {
            return Object.keys(res.files);
        });

        //concat received chunks
        const fileData1 = Buffer.concat(chunks1);
        const fileData2 = Buffer.concat(chunks2);

        //create form data
        const formData = new FormData();

        formData.append(keys[0], new Blob([fileData1]));
        formData.append(keys[1], new Blob([fileData2]));


        //create resource
        await createResource(formData, accessToken, req, res);
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
