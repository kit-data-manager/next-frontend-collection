import {NextApiRequest, NextApiResponse} from "next";
import {ExtendedSession} from "@/lib/definitions";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import fetch from "node-fetch";

async function listSchemas(accessToken: string | undefined, req: NextApiRequest, res: NextApiResponse) {
    const metastoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
    const {page, size, sort} = req.query;
    const body = req.body;
    let method = req.method;
    const headers = {
        "Accept": "application/json"
    };

    let url: string = `${metastoreBaseUrl}/api/v2/schemas/`;

    if (body) {
        url = `${metastoreBaseUrl}/api/v2/schemas/search`;
        headers["Content-Type"] = "application/json";
    }

    const search = new URLSearchParams();
    if (page) {
        search.set("page", page as string);
    }
    if (size) {
        search.set("size", size as string);
    }
    if (sort) {
        search.set("sort", sort as string);
    }
    const query = search ? `?${search}` : "";

    url += query;

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return fetch(url, {
        method: method,
        headers: headers,
        body: body ? body : undefined
    }).then(response => {
        if (!response.ok) {
            res.status(response.status).json({message: 'Failed to list schemas.'});
            Promise.reject('Failed to list schemas.');
        } else {
            response.headers.forEach((value, key) => {
                res.appendHeader(key, value);
            });
            return response.json();
        }
    }).then(json => res.status(200).json(json));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }
    const session: ExtendedSession | null = await getServerSession(req, res, authOptions);
    const accessToken: string | undefined = session?.accessToken;

    try {
        //list schemas
        await listSchemas(accessToken, req, res);

    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).end();
    }
}
