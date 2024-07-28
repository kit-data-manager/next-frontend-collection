"use client"

import federatedLogout from "@/lib/federatedLogout";

export default function Logout() {
    return <button onClick={() => federatedLogout()}>
       Logout
    </button>
}
