import {signOut} from "next-auth/react";
import {fetchWithBasePath} from "@/lib/general/utils";

export default async function federatedLogout() {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    const response = await fetchWithBasePath("/api/auth/federated-logout").then(response => {
        if (!response.ok) {
            console.error("Federated logout failed.")
        }
        return response.json();
    }).then(json => {
        const error = json.error;
        if (error) {
            console.log("LogoutError: ", error);
        }
    }).catch((error) => {
        console.error("Unhandled error during federated logout.", error);
    }).finally(() => {
        console.debug("Proceeding with normal sign out.");
        signOut({callbackUrl: `${basePath}`, redirect: true});
    });
}
