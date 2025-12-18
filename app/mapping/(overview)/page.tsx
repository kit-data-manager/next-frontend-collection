import * as React from 'react';
import {Suspense} from 'react';
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import MappingServiceStats from "@/app/mapping/components/Dashboard/MappingServiceStats";
import MappingServiceStatsSkeleton from "@/app/mapping/components/Dashboard/MappingServiceStatsSkeleton";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {OverviewPage} from "@/components/OverviewPage/OverviewPage";
import RepositoryStats from "@/app/base-repo/components/Dashboard/RepositoryStats";
import RepositoryStatsSkeleton from "@/app/base-repo/components/Dashboard/RepositoryStatsSkeleton";
import LatestActivities from "@/app/base-repo/components/Dashboard/LatestActivities";
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";

export default async function Page() {
    const basePath: string = ((withBasePath && process.env.NEXT_PUBLIC_BASE_PATH) ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    const actions = [
        {
            icon: "add",
            title: "Create Mapping",
            subtitle: "Start a new mapping",
            href: `${basePath}/mapping/map`,
            requiresAuth: true,
        }
    ];

    const availableActions = actions.filter(action => {
        return !(action.requiresAuth && !session);
    });

    return (
        <OverviewPage
            title="Overview"
            breadcrumbs={[
                {label: "Overview", href: '/mapping', active: true}
            ]}
            stats={<RepositoryStats />}
            statsFallback={<RepositoryStatsSkeleton />}
            actions={availableActions}
        />
    );
}
