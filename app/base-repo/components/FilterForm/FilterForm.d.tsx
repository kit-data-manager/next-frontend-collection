import {TypeGeneral, State, Sort} from "@/lib/definitions";

export type FilterForm = {
    id?: string | undefined;
    publisher?: string | undefined;
    publicationYear?: string | undefined;
    state?: State;
    typeGeneral?: TypeGeneral;
    sort: Sort;
};
