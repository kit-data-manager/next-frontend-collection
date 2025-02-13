import {fetchActuatorHealth, fetchActuatorInfo, fetchKeyCloakStatus} from "@/lib/base-repo/client-data";
import {StatusCard} from "@/components/StatusCard/StatusCard";
import {humanFileSize} from "@/lib/general/format-utils";
import {ActuatorHealth, ActuatorInfo, KeycloakInfo} from "@/lib/definitions";
import {lusitana} from "@/components/fonts";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {ExtendedSession} from "@/lib/next-auth/next-auth";
import ServiceStatusCard from "@/components/ServiceStatusCard";

export default async function SystemStats() {
    const data:ExtendedSession | null = await getServerSession(authOptions);

    const repoInstanceName: string = process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME ? process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName = process.env.NEXT_PUBLIC_METASTORE_INSTANCE_NAME ? process.env.NEXT_PUBLIC_METASTORE_INSTANCE_NAME : "Metadata Repository";
    const mappingInstanceName = process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME ? process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME : "Mapping Service";

    const repoAvailable:boolean = (process.env.NEXT_PUBLIC_REPO_AVAILABLE ? process.env.NEXT_PUBLIC_REPO_AVAILABLE : "false") == "true";
    const metaStoreAvailable:boolean = (process.env.NEXT_PUBLIC_METASTORE_AVAILABLE ? process.env.NEXT_PUBLIC_METASTORE_AVAILABLE : "false") == "true";
    const mappingAvailable:boolean = (process.env.NEXT_PUBLIC_MAPPING_AVAILABLE ? process.env.NEXT_PUBLIC_MAPPING_AVAILABLE : "false") == "true";
    const typedPidMakerAvailable:boolean = (process.env.NEXT_PUBLIC_TYPED_PID_MAKER_AVAILABLE ? process.env.NEXT_PUBLIC_TYPED_PID_MAKERG_AVAILABLE : "false") == "true";

    const repoBaseUrl: string = process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : '';
    const metaStoreBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';
    const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
    const typedPidMakerBaseUrl: string = process.env.NEXT_PUBLIC_TYPED_PID_MAKER_BASE_URL ? process.env.NEXT_PUBLIC_TYPED_PID_MAKER_BASE_URL : '';

    const keycloakUrl: string = process.env.KEYCLOAK_ISSUER ? process.env.KEYCLOAK_ISSUER : '';

    let actuatorInfoBaseRepo: ActuatorInfo | undefined = undefined;
    let actuatorHealthBaseRepo:ActuatorHealth | undefined = undefined;
    let actuatorInfoMetaStore: ActuatorInfo | undefined = undefined;
    let actuatorHealthMetaStore:ActuatorHealth | undefined = undefined;
    let actuatorInfoMappingService: ActuatorInfo | undefined = undefined;
    let actuatorHealthMappingService:ActuatorHealth | undefined = undefined;
    let actuatorInfoTypedPIDMaker: ActuatorInfo | undefined = undefined;
    let actuatorHealthTypedPIDMaker:ActuatorHealth | undefined = undefined;

    let keycloakInfo: KeycloakInfo | undefined = undefined;
    let validTiles = 0;

    if (repoAvailable) {
        actuatorInfoBaseRepo = await fetchActuatorInfo(repoBaseUrl, data?.accessToken);
        actuatorHealthBaseRepo = await fetchActuatorHealth(repoBaseUrl, data?.accessToken);
        validTiles++;
    }

    if (metaStoreAvailable) {
        actuatorInfoMetaStore = await fetchActuatorInfo(metaStoreBaseUrl, data?.accessToken);
        actuatorHealthMetaStore = await fetchActuatorHealth(metaStoreBaseUrl, data?.accessToken);
        validTiles++;
    }

    if (mappingAvailable) {
        actuatorInfoMappingService = await fetchActuatorInfo(mappingBaseUrl, data?.accessToken);
        actuatorHealthMappingService = await fetchActuatorHealth(mappingBaseUrl, data?.accessToken);
        validTiles++;
    }

    if(typedPidMakerAvailable){
        actuatorInfoTypedPIDMaker = await fetchActuatorInfo(typedPidMakerBaseUrl, data?.accessToken);
        actuatorHealthTypedPIDMaker = await fetchActuatorHealth(typedPidMakerBaseUrl, data?.accessToken);
        validTiles++;
    }

    if (keycloakUrl != '') {
        keycloakInfo = await fetchKeyCloakStatus(keycloakUrl);
        validTiles++;
    }

    let missingCols = validTiles % 4;
    let missing:number[] = [];
    if(missingCols != 0){
        missing = Array(missingCols).fill(0);
    }

    return (
        <>
            {actuatorInfoBaseRepo ?
                <ServiceStatusCard
                    key={"1"}
                    serviceName={repoInstanceName}
                    serviceVersion={actuatorInfoBaseRepo.status === 1 ? `${actuatorInfoBaseRepo.version}` : `Unknown`}
                    status={actuatorInfoBaseRepo.status === 1? "active" : actuatorInfoBaseRepo.status === 0 ? "maintenance" : "inactive"}
                    link={actuatorInfoBaseRepo.status === 1 ? `/base-repo` : undefined}
                    ledStatus={ [
                        { status: actuatorHealthBaseRepo?.harddisk.status, tooltip: actuatorHealthBaseRepo?.harddisk.details },
                        { status: actuatorHealthBaseRepo?.database.status, tooltip: actuatorHealthBaseRepo?.database.details },
                        { status: actuatorHealthBaseRepo?.elastic.status, tooltip: actuatorHealthBaseRepo?.elastic.details },
                        { status: actuatorHealthBaseRepo?.rabbitMq.status, tooltip: actuatorHealthBaseRepo?.rabbitMq.details }
                    ]}
                /> : null
            }

            {actuatorInfoMetaStore ?
                <ServiceStatusCard
                    key={"2"}
                    serviceName={metastoreInstanceName}
                    serviceVersion={actuatorInfoMetaStore.status === 1 ? `${actuatorInfoMetaStore.version}` : `Unknown`}
                    status={actuatorInfoMetaStore.status === 1? "active" : actuatorInfoMetaStore.status === 0 ? "maintenance" : "inactive"}
                    link={actuatorInfoMetaStore.status === 1 ? `/metastore` : undefined}
                    ledStatus={ [
                        { status: actuatorHealthMetaStore?.harddisk.status, tooltip: actuatorHealthMetaStore?.harddisk.details },
                        { status: actuatorHealthMetaStore?.database.status, tooltip: actuatorHealthMetaStore?.database.details },
                        { status: actuatorHealthMetaStore?.elastic.status, tooltip: actuatorHealthMetaStore?.elastic.details },
                        { status: actuatorHealthMetaStore?.rabbitMq.status, tooltip: actuatorHealthMetaStore?.rabbitMq.details }
                    ]}
                />  : null
            }

            {actuatorInfoMappingService ?
                <ServiceStatusCard
                    key={"3"}
                    serviceName={mappingInstanceName}
                    serviceVersion={actuatorInfoMappingService.status === 1 ? `${actuatorInfoMappingService.version}` : `Unknown`}
                    status={actuatorInfoMappingService.status === 1? "active" : actuatorInfoMappingService.status === 0 ? "maintenance" : "inactive"}
                    link={actuatorInfoMappingService.status === 1 ? `/mapping` : undefined}
                    ledStatus={ [
                        { status: actuatorHealthMappingService?.harddisk.status, tooltip: actuatorHealthMappingService?.harddisk.details },
                        { status: actuatorHealthMappingService?.database.status, tooltip: actuatorHealthMappingService?.database.details },
                        { status: actuatorHealthMappingService?.elastic.status, tooltip: actuatorHealthMappingService?.elastic.details },
                        { status: actuatorHealthMappingService?.rabbitMq.status, tooltip: actuatorHealthMappingService?.rabbitMq.details }
                    ]}
                />  : null
            }

            {actuatorInfoTypedPIDMaker ?
                <ServiceStatusCard
                    key={"4"}
                    serviceName={"FAIR DO Repo"}
                    serviceVersion={actuatorInfoTypedPIDMaker.status === 1 ? `${actuatorInfoTypedPIDMaker.version}` : `Unknown`}
                    status={actuatorInfoTypedPIDMaker.status === 1? "active" : actuatorInfoTypedPIDMaker.status === 0 ? "maintenance" : "inactive"}
                    link={actuatorInfoTypedPIDMaker.status === 1 ? `/typed-pid-maker` : undefined}
                    ledStatus={[
                        { status: actuatorHealthTypedPIDMaker?.harddisk.status, tooltip: actuatorHealthTypedPIDMaker?.harddisk.details },
                        { status: actuatorHealthTypedPIDMaker?.database.status, tooltip: actuatorHealthTypedPIDMaker?.database.details },
                        { status: actuatorHealthTypedPIDMaker?.elastic.status, tooltip: actuatorHealthTypedPIDMaker?.elastic.details },
                        { status: actuatorHealthTypedPIDMaker?.rabbitMq.status, tooltip: actuatorHealthTypedPIDMaker?.rabbitMq.details }
                    ]}
                /> : null
            }

            {keycloakInfo ?
                <ServiceStatusCard
                    key={"5"}
                    serviceName={"Keycloak"}
                    serviceVersion={`Realm: ${keycloakInfo.realm}`}
                    status={keycloakInfo.status === 1? "active" : keycloakInfo.status === 0 ? "maintenance" : "inactive"}
                    ledStatus={ [
                    ]}
                    link={undefined}
                /> : null
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

export async function ActuatorHealthStatusCardWrapper({serviceUrl}: {
    serviceUrl: string
}) {
    const actuatorInfo = await fetchActuatorHealth(serviceUrl);

    return (
        <>
            <StatusCard cardStatus={
                {
                    title: "Database",
                    subtitle: actuatorInfo.database.details,
                    status: statusStringToInt(actuatorInfo.database.status)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "HardDisk",
                    subtitle: humanFileSize(actuatorInfo.harddisk.details) + " free",
                    status: statusStringToInt(actuatorInfo.harddisk.status)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "RabbitMQ",
                    subtitle: actuatorInfo.rabbitMq.details,
                    status: statusStringToInt(actuatorInfo.rabbitMq.status)
                }
            }/>
            <StatusCard cardStatus={
                {
                    title: "Elastic",
                    subtitle: actuatorInfo.elastic.details,
                    status: statusStringToInt(actuatorInfo.elastic.status)
                }
            }/>
        </>
    );
}
