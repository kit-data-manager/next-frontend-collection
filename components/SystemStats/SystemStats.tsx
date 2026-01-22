import {
    fetchActuatorHealth,
    fetchActuatorInfo,
    fetchKeyCloakStatus,
} from "@/lib/base-repo/client-data";

import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import ServiceStatusCard from "@/components/ServiceStatusCard/ServiceStatusCard";
import { lusitana } from "@/components/fonts";


export default async function SystemStats() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";


    const services = [
        {
            name: process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME ?? "Data Repository",
            available: process.env.NEXT_PUBLIC_REPO_AVAILABLE === "true",
            baseUrl: process.env.NEXT_PUBLIC_REPO_BASE_URL,
            link: `${basePath}/base-repo`,
            leds: ["harddisk", "database", "elastic", "rabbitMq"],
        },
        {
            name: process.env.NEXT_PUBLIC_METASTORE_INSTANCE_NAME ?? "Metadata Repository",
            available: process.env.NEXT_PUBLIC_METASTORE_AVAILABLE === "true",
            baseUrl: process.env.NEXT_PUBLIC_METASTORE_BASE_URL,
            link: `${basePath}/metastore`,
            leds: ["harddisk", "database", "elastic", "rabbitMq"],
        },
        {
            name: process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME ?? "Mapping Service",
            available: process.env.NEXT_PUBLIC_MAPPING_AVAILABLE === "true",
            baseUrl: process.env.NEXT_PUBLIC_MAPPING_BASE_URL,
            link: `${basePath}/mapping`,
            leds: ["harddisk", "database", "elastic", "rabbitMq"],
        },
        {
            name: "Site Search",
            available: !!process.env.NEXT_PUBLIC_SEARCH_BASE_URL,
            baseUrl: process.env.NEXT_PUBLIC_SEARCH_BASE_URL?.replace("/api/v1/", ""),
            link: `${basePath}/search`,
            leds: ["elastic"],
        },
        {
            name: "FAIR DO Repo",
            available: process.env.NEXT_PUBLIC_TYPED_PID_MAKER_AVAILABLE === "true",
            baseUrl: process.env.NEXT_PUBLIC_TYPED_PID_MAKER_BASE_URL,
            link: `${basePath}/typed-pid-maker`,
            leds: ["harddisk", "database", "elastic", "rabbitMq"],
        },
    ];

    //fetch actuators
    const results = await Promise.all(
        services.map(async (svc) => {
            if (!svc.available || !svc.baseUrl)
                return null;

            const info = await fetchActuatorInfo(svc.baseUrl, token);
            const health = await fetchActuatorHealth(svc.baseUrl, token);

            return { ...svc, info, health };
        })
    );

    //obtain keycloak status
    let keycloak: any = null;

    if (process.env.KEYCLOAK_ISSUER) {
        const kc = await fetchKeyCloakStatus(process.env.KEYCLOAK_ISSUER);
        keycloak = {
            name: "Keycloak",
            info: { version: `Realm: ${kc.realm}`, status: kc.status },
            health: {},
            link: undefined,
            leds: [],
        };
    }

    const finalServices = [...results.filter(Boolean), keycloak].filter(Boolean);

    const remainder = finalServices.length % 4;
    const missing = remainder > 0 ? 4 - remainder : 0;

    return (
        <>
            {finalServices.map((svc: any, i: number) => (
                <ServiceStatusCard
                    key={i}
                    serviceName={svc.name}
                    serviceVersion={svc.info?.status === 1 ? svc.info.version : "Unknown"}
                    status={
                        svc.info?.status === 1
                            ? "active"
                            : svc.info?.status === 0
                                ? "maintenance"
                                : "inactive"
                    }
                    link={svc.info?.status === 1 ? svc.link : undefined}
                    ledStatus={
                        svc.leds.map((key: string) => ({
                            status: svc.health?.[key]?.status,
                            tooltip: svc.health?.[key]?.details,
                        })) ?? []
                    }
                />
            ))}

            {Array.from({ length: missing }).map((_, i) => (
                <div
                    key={i}
                    className={`${lusitana.className} opacity-10 w-full bg-card
                      border border-gray-200 shadow-md p-4 rounded-md`}
                />
            ))}
        </>
    );
}
