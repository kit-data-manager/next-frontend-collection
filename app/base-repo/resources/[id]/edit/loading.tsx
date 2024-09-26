import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";

export default function Loading() {
    return (
        <>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `Edit Resource`,
                        href: `/base-repo/resources/0/edit`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Edit Resource"}/>
        <span>Loading editor...</span>
        </>);
}
