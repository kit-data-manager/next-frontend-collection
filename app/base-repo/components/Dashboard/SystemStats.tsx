"use server";

import {fetchActuatorInfo} from "@/lib/base-repo/data";
import {StatusCard} from "@/components/StatusCard/StatusCard";
import {humanFileSize} from "@/lib/format-utils";

export default async function OverallStatusCardWrapper() {
    const repoInstanceName:string = process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName= process.env.METASTORE_INSTANCE_NAME ? process.env.METASTORE_INSTANCE_NAME : "Metadata Repository";

    return (
        <>
            <StatusCard cardStatus={
                {
                    title: repoInstanceName,
                    subtitle: "v1.2.3",
                    status: 1,
                    visitRef:'/base-repo/resources',
                    detailsRef:"/base-repo"
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: metastoreInstanceName,
                    subtitle: "v1.0.0",
                    status: -1,
                    visitRef: '/metastore',
                    detailsRef: "/"
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "FAIR DO Repo",
                    subtitle: "v1.0.0",
                    status: 0,
                    visitRef: '/typed-pid-maker',
                    detailsRef: "/"
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "Keycloak",
                    status: 0
                }
            }/>
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
            <StatusCard cardStatus={
                {
                    title: "Database",
                    subtitle:actuatorInfo.database,
                    status: statusStringToInt(actuatorInfo.databaseStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "HardDisk",
                    subtitle:humanFileSize(actuatorInfo.harddisk) + " free",
                    status: statusStringToInt(actuatorInfo.harddiskStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "RabbitMQ",
                    subtitle:actuatorInfo.rabbitMq,
                    status: statusStringToInt(actuatorInfo.rabbitMqStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "Elastic",
                    subtitle:actuatorInfo.elastic,
                    status: statusStringToInt(actuatorInfo.elasticStatus)
                }
            }/>
        </>
    );
}
