import {fetchCardData} from '@/app/lib/data';
import {Card} from "@/app/ui/card";
import {fetchActuatorInfo} from "@/app/lib/base-repo/data";
import {humanFileSize} from "@/app/lib/utils";


export default async function OverallStatusCardWrapper() {
   /* const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();*/


    return (
        <>
            <Card title="Data Repo" subtitle={"v1.2.3"} status={1} visitRef={'/base-repo'} detailsRef={"/"}/>
            <Card title="Metadata Repo" status={-1} visitRef={'/metastore'} detailsRef={"/"}/>
            <Card title="FAIR DO Repo" status={0} visitRef={'/typed-pid-maker'} detailsRef={"/"}/>
            <Card title="Keycloak" status={0}/>
        </>
    );
}

function statusStringToInt(status){
    switch(status){
        case "UP": return 1;
        case "DOWN": return 0;
        default: return -1;
    }
}

export async function BaseRepoStatusCardWrapper() {
    const actuatorInfo = await fetchActuatorInfo();
    console.log("Result:", actuatorInfo);
    return (
        <>
            <Card title="Database" subtitle={actuatorInfo.database} status={statusStringToInt(actuatorInfo.databaseStatus)}/>
            <Card title="Harddisk" subtitle={humanFileSize(actuatorInfo.harddisk) + " free"} status={statusStringToInt(actuatorInfo.harddiskStatus)}/>
            <Card title="RabbitMQ" subtitle={actuatorInfo.rabbitMq} status={statusStringToInt(actuatorInfo.rabbitMqStatus)}/>
            <Card title="Elastic" subtitle={actuatorInfo.elastic} status={statusStringToInt(actuatorInfo.elasticStatus)}/>
        </>
    );
}
