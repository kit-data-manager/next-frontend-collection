import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

export interface GenericListingProps<T> {
    page: number;
    size: number;
    sort?: string;

    fetchPage: (
        page: number,
        size: number,
        sort: string | undefined,
        accessToken?: string
    ) => Promise<{ totalPages: number; resources: T[] }>;

    renderCard: (args: {
        resource: T;
        actionEvents: ActionButtonInterface[];
        onAction: (event: CustomEvent, resource: T) => void;
    }) => React.ReactNode;

    buildActions: (
        resource: T,
        session: any
    ) => ActionButtonInterface[];

    backRef: string;
}
