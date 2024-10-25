import {ReactNode, useState} from "react";
import {getServerSession} from "next-auth";
import NextAuth from "next-auth/src";

export default function ConfigProvider({ children }: { children: ReactNode }) {

   // const [repoInstanceName, setRepoInstanceName] = useState(process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME ? process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME : "Data Repository12");

getServerSession(NextAuth)
    /*const repoInstanceName: string = process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName = process.env.METASTORE_INSTANCE_NAME ? process.env.METASTORE_INSTANCE_NAME : "Metadata Repository";

    const repoAvailable:boolean = (process.env.REPO_AVAILABLE ? process.env.REPO_AVAILABLE : "false") == "true";
    const metaStoreAvailable:boolean = (process.env.METASTORE_AVAILABLE ? process.env.METASTORE_AVAILABLE : "false") == "true";

    const repoBaseUrl: string = process.env.REPO_BASE_URL ? process.env.REPO_BASE_URL : '';
    const metaStoreBaseUrl: string = process.env.METASTORE_BASE_URL ? process.env.METASTORE_BASE_URL : '';
    const keycloakUrl: string = process.env.KEYCLOAK_ISSUER ? process.env.KEYCLOAK_ISSUER : '';
    */
    return (
        <>
          {children}
        </>
    )
}
