import * as React from 'react';
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {OverviewPage} from "@/components/OverviewPage/OverviewPage";
import MappingServiceStats from "@/app/mapping/components/Dashboard/MappingServiceStats";
import MappingServiceStatsSkeleton from "@/app/mapping/components/Dashboard/MappingServiceStatsSkeleton";
import {ActionCardProps} from "@/components/OverviewPage/ActionCard";

export default async function Page() {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH) ? process.env.NEXT_PUBLIC_BASE_PATH : "";
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    let actions:ActionCardProps[] =[
        {
        icon: "add",
        title: "Create Mapping",
        subtitle: "Start a new mapping",
        href: `${basePath}/mapping/map`,
        requiresAuth: true
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
            stats={<MappingServiceStats />}
            statsFallback={<MappingServiceStatsSkeleton />}
            actions={availableActions}
        />
    );
}
