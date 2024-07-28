import {NextApiRequest, NextApiResponse} from "next";
import fetch from 'node-fetch';
import stream from 'stream';
import {promisify} from 'util';
import {toast} from "react-toastify";

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
        const pipeline = promisify(stream.pipeline);
        const {resourceId, filename} = req.query;
        if(!resourceId || !filename){
            res.status(500).json({message: 'Either resourceId or filename not provided.'})
            return
        }

        const url = `http://localhost:8081/api/v1/dataresources/${resourceId}/data/${filename}`;
        let realFilename = filename;
        if (realFilename.indexOf("/")) {
            realFilename = realFilename.substring(realFilename.lastIndexOf("/") + 1)
        }

        //Request the file
        const fileRes = await fetch(url, {headers: {"Accept": "application/vnd.datamanager.content-information+json"}})
            .then(response => {
                if (!response.ok) {
                    res.status(404).json({message: 'Not found'});
                    Promise.reject("Not found");
                }

                return response.json();
            }).then(json => {
                return json["mediaType"];
            }).then(mediaType => {
                return fetch(url).then(response => {
                    res.setHeader('Content-Type', mediaType);
                    res.setHeader('Content-Disposition', `attachment; filename=${realFilename}`);

                    //Pipe the file data
                    return pipeline(response.body, res);
                });
            });

        //If no file, return 404
        /*  if (!fileRes.ok) {
              res.status(404).json({message: 'Not found'});
              return;
          }*/

        //Set the proper headers


    } catch (exception) {
        //Conceal the exception, but log it
        console.warn(exception)
        res.status(500).json({message: 'Internal Server Error'});
    }
}


