export type ActionButtonInterface =
    | {
    label: string;
    url: string;
    urlTarget?: string;
    iconName: string;
    tooltip?:string;
    position?: 'metadata-container';
}
    | {
    label: string;
    iconName: string;
    eventIdentifier: string;
    tooltip?:string;
    position?: 'metadata-container';
};
