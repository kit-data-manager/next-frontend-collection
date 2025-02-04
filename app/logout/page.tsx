"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        signOut({ callbackUrl: "/", redirect: true }).then(() => router.push("/"))
    }, [router])

    return <div>Please wait...</div>
}
