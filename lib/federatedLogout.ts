import { signOut } from "next-auth/react";
import {fetchWithBasePath} from "@/lib/utils";

export default async function federatedLogout() {
    try {
        const response = await fetchWithBasePath("/api/auth/federated-logout");
        const data = await response.json();
        if (response.ok) {
            await signOut({ redirect: false });
            window.location.href = data.url;
            return;
        }
        throw new Error(data.error);
    } catch (error) {
        console.log(error)
        alert(error);
        await signOut({ redirect: false });
        window.location.href = "/";
    }
}
