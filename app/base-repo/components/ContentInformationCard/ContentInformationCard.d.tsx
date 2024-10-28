import {ContentInformation} from "@/lib/definitions";

export interface ContentInformationCardProps  {
    data: ContentInformation;
    variant?: "default"|"detailed"|"minimal" | undefined;
    childrenVariant?: "default" | "minimal";
    actionEvents?: string[];
    onActionClick?: (action: ActionButtonInterface) => void;
}

export type ActionButtonInterface =
    | {
    label: string;
    url: string;
    urlTarget?: string;
    iconName: string;
    position?: 'metadata-container';
}
    | {
    label: string;
    iconName: string;
    eventIdentifier: string;
    position?: 'metadata-container';
};
