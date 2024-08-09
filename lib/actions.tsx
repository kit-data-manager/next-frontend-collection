'use server';
import {Pool} from "pg";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {number} from "prop-types";

export async function filterResources(formData: FormData) {
    const resourceId = formData.get("id");
    const publisher = formData.get("publisher");
    const state = formData.get("state");
    const pubYear = formData.get("publicationYear");
    const typeGeneral = formData.get("typeGeneral");

    revalidatePath('/base-repo/resources/');
    let path:string = '/base-repo/resources';

    if(resourceId || publisher || state || pubYear || typeGeneral){
        path += "?";
    }

    if(resourceId){
        path += `resourceId=${resourceId}&`;
    }

    if(publisher){
        path += `publisher=${publisher}&`;
    }

    if(state){
        path += `state=${state}&`;
    }

    if(pubYear){
        path += `publicationYear=${pubYear}`;
    }

    if(typeGeneral){
        path += `typeGeneral=${typeGeneral}`;
    }

    redirect(path);
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    try {
        const client = new Pool({
            user:process.env.DB_USER,
            host:process.env.DB_HOST,
            database:process.env.DB_NAME,
            password:process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })

    await client.query('DELETE FROM invoices WHERE id = \'' + id + '\'');
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
    revalidatePath('/dashboard/invoices');
}
