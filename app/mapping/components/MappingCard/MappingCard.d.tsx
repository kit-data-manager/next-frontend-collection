import {DataResource} from "@/lib/definitions";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";
import {Mapping} from "@/lib/mapping/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";

export interface MappingCardProps  {
    data: Mapping;
    variant?: "default"|"detailed"|"minimal" | undefined;
    childrenVariant?: "default" | "minimal";
    actionEvents?: ActionButtonInterface[];
    onActionClick?: (action: DataCardCustomEvent<ActionEvent>) => void;
    jobRegistrationCallback: Function;
    jobUnregistrationCallback: Function;
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
