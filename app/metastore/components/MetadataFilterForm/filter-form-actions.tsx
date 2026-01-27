'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

export async function filterMetadata(formData: FormData) {
    const schemaId = formData.get("schemaId");


    revalidatePath('/metastore/metadata/');
    let path:string = '/metastore/metadata';

    if(schemaId){
        path += "?";
    }

    if(schemaId){
        path += `schemaId=${schemaId}`;
    }

    redirect(path);
}
