import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
    let session = undefined;
    try {
        session = await getServerSession(authOptions)
    } catch (error) {
    }
    return session;
}
