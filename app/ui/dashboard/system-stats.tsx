import {
    DocumentIcon,
    DocumentTextIcon,
    CircleStackIcon,
    LockOpenIcon,
    LockClosedIcon,
    UserIcon,
    XCircleIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';

import {lusitana} from '@/app/ui/fonts';
import clsx from "clsx/clsx";
import {Card} from "@/app/ui/card";

const iconMap = {
    INITIAL: PlusCircleIcon,
    TERMINAL: XCircleIcon
};


export default async function SystemStats() {
    // const latestInvoices = await fetchLatestInvoices();

    {/**SELECT sna.type, sna.managed_type, com.author, com.commit_date FROM
     jv_snapshot as sna, jv_commit as com WHERE com.commit_pk = sna.global_id_fk AND
     managed_type IN ('edu.kit.datamanager.repo.domain.ContentInformation', 'edu.kit.datamanager.repo.domain.DataResource');*/
    }

    const stats = [{
        "text": "Unique Users",
        "value": "12",
        "icon": UserIcon
    },
        {
            "text": "Resources",
            "value": "1.100",
            "icon": DocumentIcon
        },
        {
            "text": "Public Resources",
            "value": "552",
            "icon": LockOpenIcon
        },
        {
            "text": "Protected Resources",
            "value": "548",
            "icon": LockClosedIcon
        },
        {
            "text": "Files",
            "value": "2.201",
            "icon": DocumentTextIcon
        },
        {
            "text": "File Size",
            "value": "20 GB",
            "icon": CircleStackIcon
        }
    ]

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Content Overview
            </h2>
            <div class="grid grid-cols-2 gap-4 px-4 py-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} title={stat.value} subtitle={stat.text}  icon={<Icon className="w-6 h-6"/>} status={0}/>
                    );
                })}
            </div>
        </div>
    );
}
