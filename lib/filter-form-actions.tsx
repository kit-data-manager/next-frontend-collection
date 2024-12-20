'use server';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

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
        path += `publicationYear=${pubYear}&`;
    }

    if(typeGeneral){
        path += `typeGeneral=${typeGeneral}`;
    }

    redirect(path);
}
