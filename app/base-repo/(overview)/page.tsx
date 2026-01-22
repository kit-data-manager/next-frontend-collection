import RepositoryStats from "@/app/base-repo/components/Dashboard/RepositoryStats";
import LatestActivities from "@/app/base-repo/components/Dashboard/LatestActivities";
import * as React from 'react';
import RepositoryStatsSkeleton from "@/components/Skeletons/RepositoryStatsSkeleton";
import {OverviewPage} from "@/components/OverviewPage/OverviewPage";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {ActionCardProps} from "@/components/OverviewPage/ActionCard";
import {ActivityListSkeleton} from "@/components/Skeletons/ActivityListSkeleton";

export default async function Page() {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH) ? process.env.NEXT_PUBLIC_BASE_PATH : "";
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    const actions:ActionCardProps[] = [
        {
            icon: "add",
            title: "Create Resource",
            subtitle: "Start a new resource",
            href: `${basePath}/base-repo/resources/create`,
            requiresAuth: true,
        },
        {
            icon: "list",
            title: "List Resources",
            subtitle: "View all resources",
            href: `${basePath}/base-repo/resources`,
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
                {label: "Overview", href: '/base-repo', active: true}
            ]}
            stats={<RepositoryStats />}
            statsFallback={<RepositoryStatsSkeleton />}
            activities={<LatestActivities />}
            activitiesFallback={<ActivityListSkeleton />}
            actions={availableActions}
        />
    );
}
