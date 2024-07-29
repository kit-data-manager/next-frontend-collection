export function valueOrDefault(inputObject:any, key:string, defaultIfNotPresent:any){
        if(!inputObject){
            return defaultIfNotPresent;
        }

        return inputObject.hasOwnProperty(key) ? inputObject[key] : defaultIfNotPresent;
}