import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {Activity} from "@/lib/definitions";

export async function fetchMetastoreOverview() {
    noStore()

    //initial values (defaults if database query fails)
    let uniqueUsers = 0;
    let resources = 0;
    let openResources = 0;
    let closedResources = 0;
    let schemas = 0;
    let metadata = 0;

    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.METASTORE_DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })

        //build queries
        const uniqueUsersPromise = client.query("SELECT COUNT(DISTINCT sid) FROM acl_entry");
        const resourcesPromise = client.query("SELECT COUNT(*) FROM \n" +
            "(SELECT resource_type.type_general, data_resource.state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j\n" +
            "WHERE j.type_general = 'MODEL' AND j.state IN ('VOLATILE', 'FIXED');");
        const openResourcesPromise = client.query("SELECT COUNT(*) FROM \n" +
            "(SELECT acl_entry.sid, data_resource.resource_id, data_resource.state FROM data_resource JOIN acl_entry ON data_resource.id = acl_entry.resource_id) as j\n" +
            "WHERE j.sid='anonymousUser' AND j.state IN ('VOLATILE', 'FIXED');");
        const schemaCountPromise = client.query("SELECT COUNT(*) FROM " +
            "(SELECT type_general, resource_id, resource_type.value as res_val, state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j " +
            "WHERE j.type_general='MODEL' AND j.res_val LIKE '%Schema%' AND j.state IN ('VOLATILE', 'FIXED');")
        const metadataCountPromise = client.query("SELECT COUNT(*) FROM " +
            "(SELECT type_general, resource_id, resource_type.value as res_val, state FROM data_resource JOIN resource_type ON data_resource.resource_id = resource_type.id) as j " +
            "WHERE j.type_general='MODEL' AND j.res_val LIKE '%Metadata%' AND j.state IN ('VOLATILE', 'FIXED');")

        //wait for all query results
        const data = await Promise.all([
            uniqueUsersPromise,
            resourcesPromise,
            openResourcesPromise,
            schemaCountPromise,
            metadataCountPromise
        ]);

        //extract information from query results
        uniqueUsers = Number(data[0].rows[0].count ?? '0');
        resources = Number(data[1].rows[0].count ?? '0');
        openResources = Number(data[2].rows[0].count ?? '0');
        schemas = Number(data[3].rows[0].count ?? '0');
        metadata = Number(data[4].rows[0].count ?? '0');
        closedResources = Number(schemas+metadata-openResources ?? '0');

    } catch (error) {
        console.error('Failed to fetch content overview. Database Error:', error);
    }

    //return results
    return {
        uniqueUsers,
        resources,
        openResources,
        closedResources,
        schemas,
        metadata
    };
}

export async function fetchLatestActivities():Promise<Activity[]> {
    noStore()
    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.METASTORE_DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })

        const activities = await client.query(' \
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
            ORDER BY com.commit_date DESC LIMIT 6');
        return activities.rows;
    } catch (error) {
        console.error('Failed to fetch latest activities. Database Error:', error);
        return [];
    }
}


