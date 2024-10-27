
export enum Errors {
    Unauthorized = "Unauthorized",
    Forbidden = "Forbidden",
    NotFound = "NotFound",
    InternalServerError = "InternalServerError"
}
export interface ErrorDescription{
    errorCode: Errors;
    backRef: string;
}
