import {fetchCardData} from '@/app/lib/data';
import {Card} from "@/app/ui/card";


export default async function OverallStatusCardWrapper() {
    const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();

    return (
        <>
            <Card title="Data Repo" subtitle={"v1.2.3"} status={1} visitRef={'/base-repo'} detailsRef={"/"}/>
            <Card title="Metadata Repo" status={-1} visitRef={'/metastore'} detailsRef={"/"}/>
            <Card title="FAIR DO Repo" status={0} visitRef={'/typed-pid-maker'} detailsRef={"/"}/>
            <Card title="Keycloak" status={0}/>
        </>
    );
}

export async function BaseRepoStatusCardWrapper() {
    const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();

    return (
        <>
            <Card title="Database" subtitle={"PostgreSQL"} status={1}/>
            <Card title="Harddisk" subtitle={"45GB free"} status={1}/>
            <Card title="RabbitMQ" subtitle={"v3.11.7"} status={0}/>
            <Card title="Elastic" subtitle={"Status: yellow"} status={-1}/>
        </>
    );
}
