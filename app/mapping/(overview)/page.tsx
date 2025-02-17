import {CardsSkeleton} from '@/components/skeletons';
import * as React from 'react';
import {Suspense} from 'react';
import {ActuatorHealthStatusCardWrapper} from "@/components/SystemStats/SystemStats";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import MappingServiceStats from "@/app/mapping/components/Dashboard/MappingServiceStats";
import MappingServiceStatsSkeleton from "@/app/mapping/components/Dashboard/MappingServiceStatsSkeleton";

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: "Overview", href: '/mapping', active: true},
                ]}
            />
            <SectionCaption caption={"Overview"}/>

            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex w-full flex-col">
                    <SectionCaption caption={"Usage Statistics"} level={"h2"}/>

                    <div className="grid grid-cols-3 gap-4 px-4 py-8">
                        <Suspense fallback={<MappingServiceStatsSkeleton/>}>
                            <MappingServiceStats/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
