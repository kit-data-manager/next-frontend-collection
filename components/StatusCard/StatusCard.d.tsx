import {JSX} from "react";

export interface CardStatus{
    title: string;
    subtitle?: string;
    status: number;
    icon?: JSX.Element;
    visitRef?: string;
    detailsRef?: string;
}
