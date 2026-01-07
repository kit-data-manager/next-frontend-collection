import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {Activity, MetastoreStatsType} from "@/lib/definitions";

export async function fetchMetastoreOverview() {
    noStore()

    //initial values (defaults if database query fails)
    const stats: MetastoreStatsType = {} as MetastoreStatsType;

    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.METASTORE_DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })


        const results = await Promise.allSettled([
            client.query("SELECT COUNT(DISTINCT sid) FROM acl_entry"),
            client.query("SELECT COUNT(*) FROM \n" +
                "(SELECT resource_type.type_general, data_resource.state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j\n" +
                "WHERE j.type_general = 'MODEL' AND j.state IN ('VOLATILE', 'FIXED');"),
            client.query("SELECT COUNT(*) FROM \n" +
                "(SELECT acl_entry.sid, data_resource.resource_id, data_resource.state FROM data_resource JOIN acl_entry ON data_resource.id = acl_entry.resource_id) as j\n" +
                "WHERE j.sid='anonymousUser' AND j.state IN ('VOLATILE', 'FIXED');"),
            client.query("SELECT COUNT(*) FROM " +
                "(SELECT type_general, resource_id, resource_type.value as res_val, state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j " +
                "WHERE j.type_general='MODEL' AND j.res_val LIKE '%Schema%' AND j.state IN ('VOLATILE', 'FIXED');"),
            client.query("SELECT COUNT(*) FROM " +
                "(SELECT type_general, resource_id, resource_type.value as res_val, state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j " +
                "WHERE j.type_general='MODEL' AND j.res_val LIKE '%Metadata%' AND j.state IN ('VOLATILE', 'FIXED');")
        ]);

        if (results[0].status === "fulfilled") {
            stats.uniqueUsers = Number(results[0].value.rows[0].count ?? 0);
        }else if (results[0].status === "rejected") {
            stats.uniqueUsers = 0;
        }

        if (results[1].status === "fulfilled") {
            stats.resources = Number(results[1].value.rows[0].count ?? 0);
        }else if (results[1].status === "rejected") {
            stats.resources = 0;
        }

        if (results[2].status === "fulfilled") {
            stats.openResources = Number(results[2].value.rows[0].count ?? 0);
        }else if (results[2].status === "rejected") {
            stats.openResources = 0;
        }

        if (results[3].status === "fulfilled") {
            stats.schemas = Number(results[3].value.rows[0].count ?? 0);
        }else if (results[3].status === "rejected") {
            stats.schemas = 0;
        }

        if (results[4].status === "fulfilled") {
            stats.metadata = Number(results[4].value.rows[0].sum ?? 0);
        }else if (results[4].status === "rejected") {
            stats.metadata = 0;
        }

        stats.closedResources = Number(stats.schemas + stats.metadata - stats.openResources);
    } catch (error) {
        console.error('Failed to fetch content overview. Database Error:', error);
    }

    //return results
    return stats;
}

export async function fetchLatestActivities(): Promise<Activity[]> {
    noStore()
    const client = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.METASTORE_DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT)
    })

    const results = await Promise.allSettled([client.query(' \
            SELECT \
                sna.type, \
                sna.managed_type, \
                sna.state, \
                com.author, \
                com.commit_date\
            FROM \
                jv_snapshot as sna, \
                jv_commit as com \
            WHERE \
                com.commit_pk = sna.commit_fk AND \
                sna.managed_type IN (\'edu.kit.datamanager.repo.domain.ContentInformation\', \'edu.kit.datamanager.repo.domain.DataResource\') \
            ORDER BY com.commit_date DESC LIMIT 6')
        ]);

    if (results[0].status === "fulfilled") {
        return results[0].value.rows as Activity[] ?? [] as Activity[];
    }

    return [] as Activity[];


}


