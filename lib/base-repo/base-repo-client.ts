export function toggleTag(resourceId: string, filename: string, tag: string, accessToken?: string): Promise<number> {

    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const url = `${repoBaseUrl}/api/v1/dataresources/${resourceId}/data/${filename}`;

    const headers = {
        "Accept": "application/vnd.datamanager.content-information+json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetch(url,
        {headers: headers}).then(response => {
        //get body, check if tag is there, create patch accordingly
        const etag = response.headers.get("ETag");
        headers["If-Match"] = etag ? etag : ""
        return response.json();
    }).then(content => {
        let index = content.tags ? content.tags.indexOf(tag) : -1;
        let body:any;
        if (index > -1) {
            body = [{"op": "remove", "path": `/tags/${index}`}]
        } else {
            body = [{"op": "add", "path": `/tags/-`, "value": tag}]
        }
        return body;
    }).then(async (body) => {
        headers["Accept"] = "";
        headers["Content-Type"] = "application/json-patch+json";
        return await fetch(url, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(body)
        });
    }).then(response => response.status);

}
