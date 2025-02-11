
export enum Errors {
    Unauthorized = "Unauthorized",
    Forbidden = "Forbidden",
    NotFound = "NotFound",
    Empty = "NoResults",
    InternalServerError = "InternalServerError"
}
export interface ErrorDescription{
    errorCode: Errors;
    backRef: string;
}
