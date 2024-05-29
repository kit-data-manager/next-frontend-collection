import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {DataResource} from "@/app/lib/definitions";

export async function fetchDataResources() : Promise<DataResource[]> {
    noStore()
    try {
        const res = await fetch(`http://localhost:8090/api/v1/dataresources/`);
        console.log('Data fetch completed.');
        return res.json();
    } catch (error) {
        console.error('Service Error:', error);
        throw new Error('Failed to fetch data resources.');
    }
}