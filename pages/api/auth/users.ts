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

    const {email} = req.query;

    const realm:string = process.env.KEYCLOAK_ISSUER.substring(process.env.KEYCLOAK_ISSUER.lastIndexOf("/")+ 1);
    var pathArray = process.env.KEYCLOAK_ISSUER.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var keycloakBaseUrl:string = protocol + '//' + host;

    const loginUrl = keycloakBaseUrl + "/realms/" + realm + "/protocol/openid-connect/token";
    const accessToken:string = await login(loginUrl, "service-account-nextjs" ,process.env.KEYCLOAK_CLIENT_SECRET);

    const userUrl:string = keycloakBaseUrl + "/admin/realms/" + realm + "/users?email=" + email;
    listUsers(userUrl, accessToken).then(json => res.status(200).json(json));
}
