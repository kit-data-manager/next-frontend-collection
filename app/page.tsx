import AcmeLogo from '@/app/ui/acme-logo';
import {inter, lusitana} from '@/app/ui/fonts';
import {Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import OverallStatusCardWrapper from "@/app/ui/dashboard/system-status-cards";

export default function Page() {
    const username = "anonymous";

    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-24">
                {<AcmeLogo/>}
            </div>

            <div className="mt-4 flex grow flex-col gap-4 md:flex-col">
                <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                    Status
                </h2>
                <div className="grid justify-center gap-6 rounded-lg bg-gray-50 px-6 py-0 md:h-1/5 md:px-10 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<CardsSkeleton/>}>
                        <OverallStatusCardWrapper/>
                    </Suspense>
                </div>
                <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>

                </h2>
                <div className="flex justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:h-3/5 md:px-20">
                    <p className={`${inter.className} antialiased text-l text-gray-800 md:text-xl md:leading-normal`}>
                        <strong>Welcome {username}.</strong> This is an instance of the{' '}
                        <a href="https://nextjs.org/learn/" className="text-blue-500">
                            Next Frontend Collection
                        </a>
                        , brought to you by FAIR Data Commons.
                    </p>
                    {/* <Link
                        href="/login"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6"/>
                    </Link>*/}
                </div>

            </div>

            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-12">
            </div>
        </main>
    );
}
