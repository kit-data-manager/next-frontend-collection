import {NextApiRequest, NextApiResponse} from "next";
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth-options";
import fetch from "node-fetch";

async function getSchema(resourceId: string, accessToken: string | undefined, type: "record" | "document", req: NextApiRequest, res: NextApiResponse) {
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
    const headers = {};

    if (type === "record") {
        headers["Accept"] = "application/vnd.datacite.org+json";
    }

    let url: string = `${metastoreBaseUrl}/api/v2/schemas/${resourceId}`;

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to get schema.'});
            Promise.reject(`Failed to get schema ${type}.`);
        } else {
            //transfer headers
            const headers = {};
            response.headers.forEach((value, key) => {
                //when using apache proxy, mod_deflate may disturb here
                //should be either disabled or "content-encoding" header should be removed before sending plain content
                headers[key] = value;
            });

            res.writeHead(200, headers);

            if (type === "record") {
                return response.json();
            } else {
                return response.text();
            }
        }
    }).then(json => {
        if (type === "record") {
            return res.end(JSON.stringify(json));
        } else {
            return res.end(json);
        }
    });
}

async function getMetadata(resourceId: string, accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
    const headers = {
        "Accept": "application/vnd.datamanager.metadata-record+json"
    };
    let url: string = `${metastoreBaseUrl}/api/v2/metadata/${resourceId}`;

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to get metadata.'});
            Promise.reject('Failed to get metadata.');
        } else {
            //transfer headers
            const headers = {};
            response.headers.forEach((value, key) => {
                //when using apache proxy, mod_deflate may disturb here
                //should be either disabled or "content-encoding" header should be removed before sending plain content
                headers[key] = value;
            });

            res.writeHead(200, headers);
            return response.json();
        }
    }).then(json => res.end(JSON.stringify(json)));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {
        const {resourceId, type} = req.query;

        if (!resourceId || !type) {
            res.status(500).json({message: 'resourceId or type not provided.'})
            return
        }

        if (type === "schemaRecord") {
            //list resources
            await getSchema(resourceId as string, accessToken, "record", req, res);
        } else if (type === "schemaDocument") {
            //list resources
            await getSchema(resourceId as string, accessToken, "document", req, res);
        } else if (type === "metadataRecord") {
            await getMetadata(resourceId as string, accessToken, req, res);
        }
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}
