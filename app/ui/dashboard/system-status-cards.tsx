import {fetchActuatorInfo} from "@/app/lib/base-repo/data";
import {Card} from "@/app/ui/general/card";
import {humanFileSize} from "@/app/lib/format-utils";

export default async function OverallStatusCardWrapper() {
    return (
        <>
            <Card title="Data Repo" subtitle={"v1.2.3"} status={1} visitRef={'/base-repo'} detailsRef={"/"}/>
            <Card title="Metadata Repo" status={-1} visitRef={'/metastore'} detailsRef={"/"}/>
            <Card title="FAIR DO Repo" status={0} visitRef={'/typed-pid-maker'} detailsRef={"/"}/>
            <Card title="Keycloak" status={0}/>
        </>
    );
}

function statusStringToInt(status:string){
    switch(status){
        case "UP": return 1;
        case "DOWN": return -1;
        default: return 0;
    }
}

export async function BaseRepoStatusCardWrapper() {
    const actuatorInfo = await fetchActuatorInfo();
    return (
        <>
            <Card title="Database" subtitle={actuatorInfo.database} status={statusStringToInt(actuatorInfo.databaseStatus)}/>
            <Card title="Harddisk" subtitle={humanFileSize(actuatorInfo.harddisk) + " free"} status={statusStringToInt(actuatorInfo.harddiskStatus)}/>
            <Card title="RabbitMQ" subtitle={actuatorInfo.rabbitMq} status={statusStringToInt(actuatorInfo.rabbitMqStatus)}/>
            <Card title="Elastic" subtitle={actuatorInfo.elastic} status={statusStringToInt(actuatorInfo.elasticStatus)}/>
        </>
    );
}
