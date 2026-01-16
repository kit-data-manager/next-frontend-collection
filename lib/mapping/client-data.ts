import {ResponseError} from "@/lib/base-repo/client-data";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {JobStatus, MappingPage, MappingPlugin} from "@/lib/mapping/definitions";

export async function fetchMappingPlugins(token?: string | undefined):Promise<MappingPlugin[]> {
    try {
        const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/hal+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${mappingBaseUrl}/api/v1/mappingAdministration/plugins`,
            {headers: headers}).then(result => result.json());
    } catch (error) {
        console.error('Failed to fetch mapping plugins. Error:', error);
        return Promise.reject("No plugins found");
    }
}

export async function fetchMappings(page: number, size: number, filter?: FilterForm, sort?: string,token?: string | undefined): Promise<MappingPage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let sorting = sort;
        if (!sorting) {
            sorting = "title,desc";
        }

        const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/hal+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${mappingBaseUrl}/api/v1/mappingAdministration/?page=${realPage}&size=${size}&sort=${sorting}`).then(async (res) => {
            const mappingPage: MappingPage = {} as MappingPage;
            mappingPage.resources = await res.json();
            mappingPage.page = page;
            mappingPage.pageSize = size;
            const contentRange: string | null = res.headers.get('content-range');

            if (contentRange) {
                const totalElements = Number(contentRange.substring(contentRange.lastIndexOf("/") + 1));
                mappingPage.totalPages = Math.ceil(totalElements / size);
            }
            return mappingPage;
        });
    } catch (error) {
        console.error('Failed to fetch mappings. Error:', error);
        return Promise.reject("No mappings found");
    }
}

export async function fetchMappingDocument(mappingId:string, token?: string | undefined):Promise<string> {
    try {
        const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/octet-stream", "Content-Type": "application/octet-stream"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${mappingBaseUrl}/api/v1/mappingAdministration/${mappingId}/document`,
            {headers: headers}).then(result => result.text());
    } catch (error) {
        console.error('Failed to fetch mapping document. Error:', error);
        return Promise.reject("No mapping document found.");
    }
}

export async function fetchMappingJobStatus(jobId:string, token?:string):Promise<JobStatus>{
    try {

        const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${mappingBaseUrl}/api/v1/mappingExecution/schedule/${jobId}/status`).then((res) => res.json());
    } catch (error) {
        console.error('Failed to fetch job status. Error:', error);
        throw error;//return Promise.reject("Failed to fetch job status.");
    }
}

export async function deleteMappingJobStatus(jobId:string, token?:string):Promise<boolean>{
    try {
        const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${mappingBaseUrl}/api/v1/mappingExecution/schedule/${jobId}`,{
            method: "DELETE",
            headers: headers
        }).then(result => result.ok);
    } catch (error) {
        console.error('Failed to delete mapping job. Error:', error);
    }
    return true;
}

export async function myFetch(url: string, init?: any) {
    let res: Response;
    if (init) {
        res = await fetch(url, init);
    } else {
        res = await fetch(url);
    }
    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}
