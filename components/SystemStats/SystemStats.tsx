"use server";

import {fetchActuatorHealth, fetchActuatorInfo, fetchKeyCloakStatus, fetchLatestActivities} from "@/lib/base-repo/data";
import {StatusCard} from "@/components/StatusCard/StatusCard";
import {humanFileSize} from "@/lib/format-utils";
import {ActuatorInfo, KeycloakInfo} from "@/lib/definitions";
import {lusitana} from "@/components/fonts";
import {clsx} from "clsx";

export default async function OverallStatusCardWrapper() {
    const repoInstanceName: string = process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName = process.env.METASTORE_INSTANCE_NAME ? process.env.METASTORE_INSTANCE_NAME : "Metadata Repository";

    const repoAvailable:string = process.env.REPO_AVAILABLE ? process.env.REPO_AVAILABLE : "true";
    const metaStoreAvailable:string = process.env.REPO_AVAILABLE ? process.env.REPO_AVAILABLE : "false";

    const repoBaseUrl: string = process.env.REPO_BASE_URL ? process.env.REPO_BASE_URL : '';
    const metaStoreBaseUrl: string = process.env.METASTORE_BASE_URL ? process.env.METASTORE_BASE_URL : '';
    const keycloakUrl: string = process.env.KEYCLOAK_ISSUER ? process.env.KEYCLOAK_ISSUER : '';

    let actuatorInfoBaseRepo: ActuatorInfo | undefined = undefined;
    let actuatorInfoMetaStore: ActuatorInfo | undefined = undefined;
    let actuatorInfoTypedPIDMaker: ActuatorInfo | undefined = undefined;
    let keycloakInfo: KeycloakInfo | undefined = undefined;
    let validTiles = 0;

    if (repoBaseUrl != '') {
        actuatorInfoBaseRepo = await fetchActuatorInfo(repoBaseUrl);
        validTiles++;
    }

    if (metaStoreBaseUrl != '') {
        actuatorInfoMetaStore = await fetchActuatorInfo(metaStoreBaseUrl);
        validTiles++;
    }
    if (keycloakUrl != '') {
        keycloakInfo = await fetchKeyCloakStatus(keycloakUrl);
        validTiles++;
    }

    let missing = Array(4 - validTiles % 4).fill(0);

    return (
        <>
            {actuatorInfoBaseRepo ?
                <StatusCard cardStatus={
                    {
                        title: repoInstanceName,
                        subtitle: actuatorInfoBaseRepo.version,
                        status: 1,
                        visitRef: '/base-repo/resources',
                        detailsRef: "/base-repo"
                    }
                }/> : null
            }

            {actuatorInfoMetaStore ?
                <StatusCard cardStatus={
                    {
                        title: metastoreInstanceName,
                        subtitle: "v1.0.0",
                        status: -1,
                        visitRef: '/metastore',
                        detailsRef: "/"
                    }
                }/> : null
            }

            {actuatorInfoTypedPIDMaker ?
                <StatusCard cardStatus={
                    {
                        title: "FAIR DO Repo",
                        subtitle: "v1.0.0",
                        status: 0,
                        visitRef: '/typed-pid-maker',
                        detailsRef: "/"
                    }
                }/> : null
            }

            {keycloakInfo ?
                <StatusCard cardStatus={
                    {
                        title: "Keycloak",
                        subtitle: `Realm: ${keycloakInfo.realm}`,
                        status: 1
                    }
                }/> : null
            }

            {
                missing.map((el, index) => {
                    return (<div key={index}
                        className={`${lusitana.className} opacity-10 flex flex-col bg-card text-card-foreground border shadow justify-start items-center gap-2 p-4 rounded-md`}>
                    </div>
                    )
                })
            }
        </>
    );
}

function statusStringToInt(status: string) {
    switch (status) {
        case "UP":
            return 1;
        case "DOWN":
            return -1;
        default:
            return 0;
    }
}

export async function BaseRepoStatusCardWrapper() {

    const actuatorInfo = await fetchActuatorHealth();
    return (
        <>
            <StatusCard cardStatus={
                {
                    title: "Database",
                    subtitle: actuatorInfo.database,
                    status: statusStringToInt(actuatorInfo.databaseStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "HardDisk",
                    subtitle: humanFileSize(actuatorInfo.harddisk) + " free",
                    status: statusStringToInt(actuatorInfo.harddiskStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "RabbitMQ",
                    subtitle: actuatorInfo.rabbitMq,
                    status: statusStringToInt(actuatorInfo.rabbitMqStatus)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "Elastic",
                    subtitle: actuatorInfo.elastic,
                    status: statusStringToInt(actuatorInfo.elasticStatus)
                }
            }/>
        </>
    );
}
