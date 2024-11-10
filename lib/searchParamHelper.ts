import {use} from "react";

export function valueOrDefault(inputObject:any, key:string, defaultIfNotPresent:any){
        const input = inputObject;

        if(!input){
            return defaultIfNotPresent;
        }

        return input.hasOwnProperty(key) ? input[key] : defaultIfNotPresent;
}
