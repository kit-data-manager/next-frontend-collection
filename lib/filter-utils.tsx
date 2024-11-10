import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {DataResource, ResourceType, State, TypeGeneral} from "@/lib/definitions";

export function filterFormToDataResource(filter:FilterForm | undefined):DataResource | undefined{
    if(filter){
    let resource:DataResource = {} as DataResource;

    if(filter.id){
        resource.id = filter.id;
    }
    resource.publisher = filter.publisher;
    resource.publicationYear = filter.publicationYear;
    resource.state = filter.state;
    resource.resourceType = {typeGeneral : filter.typeGeneral} as ResourceType;

    let hasProperty = (resource.id != undefined ||
        resource.publisher != undefined ||
        resource.publicationYear!= undefined ||
        resource.state != undefined ||
        resource.resourceType.typeGeneral != undefined);
        if(hasProperty){
            return resource;
        }
    }
    return undefined;
}

export function getStateList(isAdmin:boolean): State[]{
    const stateList = [State.VOLATILE, State.FIXED];

    if(isAdmin){
        stateList.push(State.REVOKED, State.GONE);
    }

    return stateList;
}

export function getTypeGeneralList(): string[]{
    return Object.keys(TypeGeneral).filter(k => isNaN(Number(k)));
}
