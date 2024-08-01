"use client"
import React from "react";
import federatedLogout from "@/lib/federatedLogout";

export default function Logout() {
    return <button onClick={() => federatedLogout()}>
       Logout
    </button>
}
