import LatestActivities from "@/app/metastore/components/Dashboard/LatestActivities";
import * as React from 'react';
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";
import RepositoryStatsSkeleton from "@/app/base-repo/components/Dashboard/RepositoryStatsSkeleton";
import MetastoreStats from "@/app/metastore/components/Dashboard/MetastoreStats";
import {OverviewPage} from "@/components/OverviewPage/OverviewPage";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {ActionCardProps} from "@/components/OverviewPage/ActionCard";

export default async function Page() {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH) ? process.env.NEXT_PUBLIC_BASE_PATH : "";
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    const actions:ActionCardProps[] = [
        {
            icon: "add",
            title: "Create Schema",
            subtitle: "Start a new schema",
            href: `${basePath}/metastore/schemas/create`,
            requiresAuth: true,
        },
        {
            icon: "list",
            title: "List Schemas",
            subtitle: "View all schemas",
            href: `${basePath}/metastore/schemas`,
            requiresAuth: false,
        },
        {
            icon: "list",
            title: "List Documents",
            subtitle: "View all documents",
            href: `${basePath}/metastore/metadata`,
            requiresAuth: false,
        },
        {
            icon: "search",
            title: "Search",
            subtitle: "Search using the site search",
            href: `${basePath}/search`,
            requiresAuth: false,
        },
    ];

    const availableActions = actions.filter(action => {
        return !(action.requiresAuth && !session);
    });

    return (
        <OverviewPage
            title="Overview"
            breadcrumbs={[
                {label: "Overview", href: '/metastore', active: true}
            ]}
            stats={<MetastoreStats />}
            statsFallback={<RepositoryStatsSkeleton />}
            activities={<LatestActivities />}
            activitiesFallback={<LatestActivitiesSkeleton />}
            actions={availableActions}
        />
    );
}
