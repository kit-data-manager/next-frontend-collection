export const mainMenuTheme = {
    "root": {
        "base": "bg-secondary px-2 py-2.5 dark:bg-secondary sm:px-4",
        "rounded": {
            "on": "rounded",
            "off": ""
        },
        "bordered": {
            "on": "border",
            "off": ""
        },
        "inner": {
            "base": "mx-auto flex flex-wrap items-center justify-between",
            "fluid": {
                "on": "",
                "off": "container"
            }
        }
    },
    "brand": {
        "base": "flex items-center"
    },
    "collapse": {
        "base": "w-full md:block md:w-auto",
        "list": "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
        "hidden": {
            "on": "hidden",
            "off": ""
        }
    },
    "link": {
        "base": "block py-2 pl-3 pr-4 md:p-0",
        "active": {
            "on": "bg-secondary text-secondary-foreground dark:text-secondary-foreground",
            "off": "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
        },
        "disabled": {
            "on": "text-muted hover:cursor-not-allowed dark:text-muted",
            "off": ""
        }
    },
    "toggle": {
        "base": "inline-flex items-center rounded-lg p-2 text-sm text-secondary-foreground hover:bg-secondary focus:outline-none focus:ring focus:ring dark:text-secondary-foreground dark:hover:underline dark:focus:ring md:hidden",
        "icon": "h-6 w-6 shrink-0"
    },
    "dropdown": {
        "base": "",
        "toggle": {
            "arrowIcon": "ml-2 h-4 w-4",
            "content": "py-1 focus:outline-none",
            "floating": {
                "animation": "transition-opacity",
                "arrow": {
                    "base": "absolute z-10 h-2 w-2 rotate-45",
                    "style": {
                        "dark": "bg-secondary dark:bg-secondary",
                        "light": "bg-secondary",
                        "auto": "bg-secondary dark:bg-secondary"
                    },
                    "placement": "-4px"
                },
                "base": "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none mt-2 block",
                "content": "py-1 text-sm text-gray-500 dark:text-gray-400",
                "divider": "my-1 h-px bg-gray-100 dark:bg-gray-600",
                "header": "block px-4 py-2 text-sm text-secondary-foreground dark:text-secondary-foreground ",
                "hidden": "invisible opacity-0",
                "item": {
                    "container": "",
                    "base": "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-secondary-foreground hover:underline focus:bg-secondary-foreground focus:outline-none dark:text-secondary-foreground dark:hover:underline dark:focus:bg-secondary-foreground",
                    "icon": "mr-2 h-4 w-4"
                },
                "style": {
                    "dark": "bg-secondary text-secondary-foreground dark:bg-secondary",
                    "light": "bg-secondary text-secondary-foreground dark:bg-secondary",
                    "auto": "bg-secondary text-secondary-foreground dark:bg-secondary"
                },
                "target": "w-fit"
            },
            "inlineWrapper": "flex w-full items-center justify-between"
        }
    },
    "dropdownToggle": {
        "base": "py-2 pl-3 pr-4 md:p-0 border-b border-primary text-secondary-foreground hover:underline dark:border-primary dark:text-secondary-foreground dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-underline md:dark:hover:bg-transparent md:dark:hover:underline flex w-full items-center justify-between"
    }
};
