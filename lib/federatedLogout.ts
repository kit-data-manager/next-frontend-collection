import { signOut } from "next-auth/react";
import {fetchWithBasePath} from "@/lib/utils";

export default async function federatedLogout() {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    try {
        const response = await fetchWithBasePath("/api/auth/federated-logout");
        const data = await response.json();
        if (response.ok) {
            await signOut({ callbackUrl:`${basePath}`, redirect: true });
           // window.location.href = data.url;
            return;
        }
        throw new Error(data.error);
    } catch (error) {
        console.log(error)
        alert(error);
        await signOut({ callbackUrl: `${basePath}`, redirect: true });
        //window.location.href = `${basePath}`;
    }
}
