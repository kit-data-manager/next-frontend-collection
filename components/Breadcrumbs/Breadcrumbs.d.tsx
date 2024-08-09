export interface BreadcrumbEntry {
    label: string;
    href: string;
    active?: boolean;
}

export const theme = {
    "root": {
        "base": "mb-6 block",
        "list": "flex items-center"
    },
    "item": {
        "base": "group flex items-center",
        "chevron": "mx-1 h-4 w-4 group-first:hidden md:mx-2",
        "href": {
            "off": "flex items-center text-sm font-medium",
            "on": "flex items-center text-sm font-medium hover:underline dark:hover:underline"
        },
        "icon": "mr-2 h-4 w-4"
    }
};
