"use client"

import * as React from "react"
import {ThemeProvider as NextThemesProvider, useTheme, ThemeProviderProps} from "next-themes"
import {useEffect} from "react";
import {setCookie} from "cookies-next";

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return <NextThemesProvider enableColorScheme {...props}>
        <AppThemeProviderHelper/>
        {children}
    </NextThemesProvider>
}

function AppThemeProviderHelper() {
    const {theme} = useTheme();

    useEffect(() => {
        setCookie("__theme__", theme, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            path: "/",
        });
    }, [theme]);

    return null;
}
