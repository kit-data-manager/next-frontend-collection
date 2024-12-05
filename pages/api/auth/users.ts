import {NextApiRequest, NextApiResponse} from "next";
import fetch from "node-fetch";

function login(url:string, username: string, password:string){
    var headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic " + btoa(`${username}:${password}`));

    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "nextjs");
    urlencoded.append("grant_type", "client_credentials");

    return fetch(url, {
        method: "POST",
        headers: headers,
        body: urlencoded,
        redirect: 'follow'
    }).then(response => {
        if (!response.ok) {
            Promise.reject('Failed to login service account.');
        }
        return response.json();
    }).then(json =>{
        return json["access_token"];
    });
}

function listUsers(url:string, accessToken:string){
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Authorization", `Bearer ${accessToken}`);

    return fetch(url, {
        method: "GET",
        headers: headers
    }).then(response => {
        if (!response.ok) {
            Promise.reject('Failed to get users.');
        }
        return response.json();
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {filter} = req.query;

    const realm:string = process.env.KEYCLOAK_ISSUER.substring(process.env.KEYCLOAK_ISSUER.lastIndexOf("/")+ 1);
    const pathArray = process.env.KEYCLOAK_ISSUER.split( '/' );
    const keycloakBaseUrl:string = pathArray[0] + '//' + pathArray[2];

    const loginUrl = `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`;
    const accessToken:string = await login(loginUrl, process.env.KEYCLOAK_SERVICE_ACCOUNT, process.env.KEYCLOAK_CLIENT_SECRET);

    const userUrl:string = `${keycloakBaseUrl}/admin/realms/${realm}/users?search=${filter}`;
    listUsers(userUrl, accessToken).then(json => res.status(200).json(json));
}
