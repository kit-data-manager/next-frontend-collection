import {twMerge} from "tailwind-merge";
import clsx, {ClassValue} from "clsx";
import {ResponseError} from "@/lib/base-repo/client_data";

export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ];
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function fetchWithBasePath(relativePath: string, init?: any) {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    let res: Response = await fetch(`${basePath}${relativePath}`, init);

    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}
/*
function resolveRefs(obj) {
    Object.keys(obj).forEach(function(prop, index, array) {
        var def = obj[prop];
        var ref;
        if (depth === 0 && prop === '$ref' && def !== null && typeof def === 'string') {
            if (def.slice(0, 14) === '#/definitions/') {
                ref = def.replace(/^#\/definitions\//, '');
                obj = _.extend(obj, defs[ref]);
                delete obj.$ref;
            } else {
                throw new Error('Unresolved $ref: ' + def);
            }
            if (resolvedSchemaRefNodes.indexOf(obj) < 0) {
                resolvedSchemaRefNodes.push(obj);
            }
        } else if (def !== null && typeof def === 'object') {
            if (def.$ref) {
                if (def.$ref.slice(0, 14) === '#/definitions/') {
                    ref = def.$ref.replace(/^#\/definitions\//, '');
                    obj[prop] = _.extend(obj[prop], defs[ref]);
                    delete obj[prop].$ref;
                } else {
                    throw new Error('Unresolved $ref: ' + def.$ref);
                }
            } else if (resolvedSchemaRefNodes.indexOf(def) < 0) {
                depth += 1;
                resolveRefs(def, defs);
                depth -= 1;
                resolvedSchemaRefNodes.push(def);
            }
        }
    });
}*/
