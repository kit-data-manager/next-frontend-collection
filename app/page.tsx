import {inter} from '@/components/fonts';
import React, {Suspense} from "react";
import {getServerSession, Session} from "next-auth";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import SystemStats, {SystemStatsSkeleton} from "@/components/SystemStats/SystemStats";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export default async function Page() {
    let session:Session | undefined = undefined;
    let authError = false;
    try {
        session = await getServerSession(authOptions) as Session;
    } catch (error) {
        authError = true;
    }

    let username = (!authError && session && session.user) ? session.user.name : "Anonymous User";
    const welcome =  process.env.NEXT_PUBLIC_WELCOME ?  process.env.NEXT_PUBLIC_WELCOME : "<strong>Welcome" + username + ".</strong> This is an instance of the"+
        "<a href='https://nextjs.org/learn/'>"+
        "Next Frontend Collection"+
        "</a>"+
        ", brought to you by FAIR Data Commons.";
    return (
        <main>
            <div className="mt-4 flex grow flex-col gap-4 lg:flex-col">
                <div className="flex justify-center gap-6 rounded-lg px-6 pt-10 md:h-3/5 lg:px-20">
                    <div className={`${inter.className} antialiased text-l lg:text-l lg:leading-normal`} dangerouslySetInnerHTML={{__html: welcome}}>
                    </div>
                </div>
                <SectionCaption caption={"Status"} level={"h2"}/>
                <div
                    className="grid justify-center gap-6 rounded-lg px-6 py-0 md:h-1/5 md:px-10 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<SystemStatsSkeleton/>}>
                        <SystemStats/>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
