import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(400).json({message: 'Not existing endpoint'})
        return
    }

    //Check if the user is signed in
    /*  if (!req.session?.credentials?.userId) {
          res.status(401).json({message: 'Access denied!'})
          return
      }*/

    try {
        const {resourceId, filename} = req.query;
        if(!resourceId || !filename){
            res.status(500).json({message: 'Either resourceId or filename not provided.'})
            return
        }

        const url = `http://localhost:8081/api/v1/dataresources/${resourceId}/data/${filename}`;
        let realFilename = filename as string;
        if (realFilename.indexOf("/")) {
            realFilename = realFilename.substring(realFilename.lastIndexOf("/") + 1)
        }


        const fileRes = await fetch(url, {
            method: "GET",
            headers: {"Accept": "application/vnd.datamanager.content-information+json"}})
            .then(response => {
                if (response.status === 404) {
                    res.status(404).json({message: 'Not found'});
                    Promise.reject("Not found");
                }else if (response.status === 401 || response.status === 403) {
                    res.status(response.status).json({message: 'Forbidden'});
                    Promise.reject("Forbidden");
                }
                return response.headers.get("ETag");
            }).then( etag => {
                return fetch(url, {
                    method: "DELETE",
                    headers: {
                        "If-Match": etag ? etag : ""
                    },
                }).then(function(response){
                    return response.status;
                });
            }).then(status => {
                if(status != 204) {
                    res.status(status).json({message: 'Failed to delete.'});
                    Promise.reject("Failed");
                }else{
                    res.status(204).json({message: 'Success'});
                    Promise.resolve();
                }
            });
    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}

