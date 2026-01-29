import React from "react";
import {getServerSession, Session} from "next-auth";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import SystemStats from "@/components/SystemStats/SystemStats";
import fs from "fs/promises";
import path from "path";

export default async function Page() {
    let session:Session | undefined = undefined;
    let authError = false;
    try {
        session = await getServerSession(authOptions) as Session;
    } catch (error) {
        authError = true;
    }
    const filePath = path.join(process.cwd(), "content", "welcome.html");
    const welcome = await fs.readFile(filePath, "utf8");

    let username = (!authError && session && session.user) ? session.user.name : "Anonymous User";
    /*const welcome =  process.env.NEXT_PUBLIC_WELCOME ?  process.env.NEXT_PUBLIC_WELCOME : `<strong>Welcome ${username}</strong>.<br/><br/> This is an instance of the ` +
        "<a href='https://github.com/kit-data-manager/next-frontend-collection'>"+
        "Next Frontend Collection"+
        "</a>. To navigate to one of the available services, please use the main menu or click on the status card of the according service. " +
        "For some operations on this frontend you may have to be logged in. Use the login button on the upper right for authenticating with one  " +
        "of the configured methods. You can always come back to this page by clicking the page logo or title.";*/
    return (
        <main>
            <div className="mt-4 flex grow flex-col gap-4 lg:flex-col">
                <div className="flex justify-center gap-6 rounded-lg px-6 pt-10 md:h-3/5 lg:px-20">
                    <div className={`antialiased text-l lg:text-l lg:leading-normal`} dangerouslySetInnerHTML={{__html: welcome}}>
                    </div>
                </div>
                <SectionCaption caption={"Status"} level={"h2"}/>
                <div
                    className="grid justify-center gap-12 rounded-lg px-6 py-0 md:h-1/5 md:px-10 sm:grid-cols-2 lg:grid-cols-4">
                        <SystemStats/>
                </div>
            </div>
        </main>
    );
}
