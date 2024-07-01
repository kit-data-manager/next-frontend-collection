'use server'

import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {DataResource} from "@/app/lib/definitions";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function fetchDataResource(id:string){
    noStore()
    try {
        const res = await fetch(`http://localhost:8081/api/v1/dataresources/${id}`).then(function(response){
            return response.json();
        });

        const content = await fetch("http://localhost:8081/api/v1/dataresources/" + res.id + "/data/",
            {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(res => res.json());

        res["children"] = content;
        const resu = await res;
        return resu;
    } catch (error) {
        console.error('Service Error:', error);
        throw new Error('Failed to fetch data resource.');
    }
}

export async function updateResource(id: string, formData: DataResource) {
    revalidatePath('/base-repo/resources');
    redirect('/base-repo/resources');
}
