import SectionCaption from "@/components/SectionCaption/SectionCaption";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {ReactNode, Suspense} from "react";
import {ActionCard, ActionCardProps} from "@/components/OverviewPage/ActionCard";

type OverviewPageProps = {
    breadcrumbs: { label: string; href: string; active?: boolean }[];
    title: string;

    stats: ReactNode;
    statsFallback: ReactNode;

    activities?: ReactNode;
    activitiesFallback?: ReactNode;

    actions: ActionCardProps[];
};

export function OverviewPage({
                                 breadcrumbs,
                                 title,
                                 stats,
                                 statsFallback,
                                 activities,
                                 activitiesFallback,
                                 actions,
                             }: OverviewPageProps) {
    return (
        <main className="flex h-full flex-col">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <SectionCaption caption={title} />

            {/* Content */}
            <div className="mt-6 grid flex-1 grid-rows-[auto_1fr] gap-6">
                {/* Top row: actions */}
                <section className="flex flex-col overflow-hidden">
                    <SectionCaption caption="Actions" level="h2" />

                    <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4 px-14 py-4 overflow-none">
                        {actions.map(action => (
                            <ActionCard
                                key={action.title}
                                icon={action.icon}
                                title={action.title}
                                subtitle={action.subtitle}
                                href={action.href}
                                className="w-full" // ensures every card fills its grid cell
                                requiresAuth={action.requiresAuth}
                            />
                        ))}
                    </div>
                </section>


                {/* Bottom row: stats + activities */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <section className="flex flex-col overflow-hidden">
                        <SectionCaption caption="Usage Statistics" level="h2" />
                        <div className="flex-1 overflow-auto px-4 py-4">
                            <Suspense fallback={statsFallback}>
                                {stats}
                            </Suspense>
                        </div>
                    </section>

                    {activities ?
                    <section className="flex flex-col overflow-hidden">
                        <SectionCaption caption="Latest Activities" level="h2" />
                        <div className="flex-1 px-4 py-4">
                            <Suspense fallback={activitiesFallback}>
                                {activities}
                            </Suspense>
                        </div>
                    </section> : null}
                </div>



            </div>
        </main>
    );
}
