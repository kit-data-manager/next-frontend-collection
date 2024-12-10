import { useEffect, useState } from "react";
import {Sort} from "@/lib/definitions";
import {JobStatus} from "@/lib/mapping/definitions";

export type UserPrefsType = {
    sortType: string,
    pageSize: string,
    theme: string,
    helpVisible:boolean,
    mappingJobs: string
}

const defaultUserPrefs: UserPrefsType = {
    sortType: Sort.NEWEST,
    pageSize: "10",
    theme:"system",
    helpVisible:true,
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
    const id = userId?userId:"anonymous";
    const key = `frontend-user-prefs-${id}`
    const [value, setValue] = useState<UserPrefsType>(() => {
        return getLocalStorage(key)
    });

    useEffect(() => {
        const currentValue = getLocalStorage(key);
        setValue(currentValue);
    }, [id])

    useEffect(() => {
        if (!value) return;
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    const updateUserPrefs = (userPref: Partial<UserPrefsType>) => {
        const currentValue = getLocalStorage(key);
        const updatedUserPrefs = { ...currentValue, ...userPref }
        setValue(updatedUserPrefs);
    }

    return { userPrefs: value, updateUserPrefs };
};

export default useUserPrefs;
