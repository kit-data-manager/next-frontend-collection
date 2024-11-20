import {ResponseError} from "@/lib/base-repo/client_data";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {DataResourcePage} from "@/lib/definitions";
import {MappingPage} from "@/lib/mapping/definitions";

export async function fetchMappingPlugins(token?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/hal+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${repoBaseUrl}/api/v1/mappingAdministration/types`,
            {headers: headers}).then(result => result.json());
    } catch (error) {
        console.error('Failed to fetch mapping plugins. Error:', error);
        return undefined;
    }
}

export async function fetchMappings(page: number, size: number, filter?: FilterForm, sort?: string,token?: string | undefined): Promise<MappingPage> {
    try {
        const realPage = Math.max(page - 1, 0);
        let sorting = sort;
        if (!sorting) {
            sorting = "title,desc";
        }

        const repoBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/hal+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${repoBaseUrl}/api/v1/mappingAdministration/?page=${realPage}&size=${size}&sort=${sorting}`).then(async (res) => {
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
export async function fetchMappingById(mappingId:string, token?: string | undefined) {
    try {
        const repoBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
        let headers = {"Accept": "application/hal+json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return await myFetch(`${repoBaseUrl}/api/v1/mappingAdministration/${mappingId}`,
            {headers: headers}).then(result => result.json());
    } catch (error) {
        console.error('Failed to fetch mapping by id. Error:', error);
        return undefined;
    }
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