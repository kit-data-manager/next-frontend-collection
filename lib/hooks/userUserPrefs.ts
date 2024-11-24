import { useEffect, useState } from "react";
import {Sort} from "@/lib/definitions";
import {JobStatus} from "@/lib/mapping/definitions";

export type UserPrefsType = {
    sortType: string,
    pageSize: string,
    theme: string,
    mappingJobs: string
}

const defaultUserPrefs: UserPrefsType = {
    sortType: Sort.NEWEST,
    pageSize: "10",
    theme:"system",
    mappingJobs: ""
}

const getLocalStorage = (key: string): UserPrefsType => {
    let currentValue;
    try {
        currentValue = JSON.parse(
            localStorage.getItem(key) || JSON.stringify(defaultUserPrefs)
        );
    } catch (error) {
        return defaultUserPrefs;
    }

    return currentValue;
}

const useUserPrefs = (userId: string | undefined) => {
    const key = `frontend-user-prefs-${userId}`
    const [value, setValue] = useState<UserPrefsType>(() => {
        if (!userId) return defaultUserPrefs;
        return getLocalStorage(key)
    });

    useEffect(() => {
        if (!userId) return;
        const currentValue = getLocalStorage(key);
        setValue(currentValue);
    }, [userId])

    useEffect(() => {
        if (!userId || !value) return;
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    const updateUserPrefs = (userPref: Partial<UserPrefsType>) => {
        if (!userId) return;
        const currentValue = getLocalStorage(key);
        const updatedUserPrefs = { ...currentValue, ...userPref }
        setValue(updatedUserPrefs);
    }

    return { userPrefs: value, updateUserPrefs };
};

export default useUserPrefs;
