'use server';
import { z } from 'zod';
import {Pool} from "pg";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
    id: z.string(),
    publisher: z.string(),
    publicationYear: z.string(),
    state: z.enum(['Volatile', 'Fixed']),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        const client = new Pool({
            user:process.env.DB_USER,
            host:process.env.DB_HOST,
            database:process.env.DB_NAME,
            password:process.env.DB_PASSWORD,
            port:process.env.DB_PORT
        })

        const values = [customerId, amountInCents, status, date]

        await client.query('INSERT INTO invoices (customer_id, amount, status, date) \
    VALUES ($1, $2, $3, $4)', values);

    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function updateInvoice (id: string, formData: FormData) {

}

export async function filterResources(formData: FormData) {
    const resourceId = formData.get("id");
    const publisher = formData.get("publisher");
    const state = formData.get("state");
    const pubYear = formData.get("publicationYear");

    revalidatePath('/base-repo/resources/');
    let path:string = '/base-repo/resources';

    if(resourceId || publisher || state || pubYear){
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
            port:process.env.DB_PORT
        })

    await client.query('DELETE FROM invoices WHERE id = \'' + id + '\'');
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
    revalidatePath('/dashboard/invoices');
}
