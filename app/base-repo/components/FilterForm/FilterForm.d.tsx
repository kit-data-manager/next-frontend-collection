export type FilterForm = {
    id: string;
    publisher: string;
    publicationYear: string;
    state: 'VOLATILE' | 'FIXED';
    typeGeneral: 'AUDIOVISUAL' | 'COLLECTION' | 'DATASET' | 'EVENT' | 'IMAGE' | 'INTERACTIVE_RESOURCE' | 'MODEL' |
    'PHYSICAL_OBJECT' | 'SERVICE' | 'SOFTWARE' | 'SOUND' | 'TEXT' | 'WORKFLOW' | 'OTHER';
};
