import {ContentInformation} from "@/lib/definitions";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export interface ContentInformationCardProps  {
    data: ContentInformation;
    variant?: "default"|"detailed"|"minimal" | undefined;
    childrenVariant?: "default" | "minimal";
    actionEvents?: ActionButtonInterface[];
    onActionClick?: (action: DataCardCustomEvent<ActionEvent>) => void;
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
