import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {Activity} from "@/lib/definitions";

export async function fetchContentOverview() {
    noStore()

    //initial values (defaults if database query fails)
    let uniqueUsers = 0;
    let resources = 0;
    let openResources = 0;
    let closedResources = 0;
    let files = 0;
    let size = 0;

    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.REPO_DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })

        //build queries
        const uniqueUsersPromise = client.query("SELECT COUNT(DISTINCT sid) FROM acl_entry");
        const resourcesPromise = client.query("SELECT COUNT(*) FROM data_resource WHERE state IN ('VOLATILE', 'FIXED')");
        const openResourcesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, acl_entry as acl WHERE resource.state IN ('VOLATILE', 'FIXED') AND resource.id=acl.resource_id AND acl.sid='anonymousUser'");
        const closedResourcesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, acl_entry as acl WHERE resource.state IN ('VOLATILE', 'FIXED') AND resource.id=acl.resource_id AND acl.sid!='anonymousUser'");
        const filesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, content_information as content WHERE resource.id=content.parent_resource_id AND resource.state IN ('VOLATILE', 'FIXED')");
        const sizePromise = client.query("SELECT SUM(content.size) FROM data_resource as resource, content_information as content WHERE resource.id=content.parent_resource_id AND resource.state IN ('VOLATILE', 'FIXED')");

        //wait for all query results
        const data = await Promise.all([
            uniqueUsersPromise,
            resourcesPromise,
            openResourcesPromise,
            closedResourcesPromise,
            filesPromise,
            sizePromise
        ]);

        //extract information from query results
        uniqueUsers = Number(data[0].rows[0].count ?? '0');
        resources = Number(data[1].rows[0].count ?? '0');
        openResources = Number(data[2].rows[0].count ?? '0');
        closedResources = Number(data[3].rows[0].count ?? '0');
        files = Number(data[4].rows[0].count ?? '0');
        size = Number(data[5].rows[0].sum ?? '0');
    } catch (error) {
        console.error('Failed to fetch content overview. Database Error:', error);
    }

    //return results
    return {
        uniqueUsers,
        resources,
        openResources,
        closedResources,
        files,
        size
    };
}

export async function fetchLatestActivities():Promise<Activity[]> {
    noStore()
    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.REPO_DB_NAME,
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

        /*return [
            {
                "id": 1,
                "type": "INITIAL",
                "managed_type": "edu.kit.datamanager.repo.domain.DataResource",
                "author": "SELF",
                "commit_date": "2023-09-21 12:52:43.325"
            },
            {
                "id": 2,
                "type": "INITIAL",
                "managed_type": "edu.kit.datamanager.repo.domain.ContentInformation",
                "author": "SELF",
                "commit_date": "2023-12-06 19:03:29.858"
            },
            {
                "id": 3,
                "type": "UPDATE",
                "managed_type": "edu.kit.datamanager.repo.domain.ContentInformation",
                "author": "SELF",
                "commit_date": "2023-12-06 19:03:29.858"
            },
            {
                "id": 4,
                "type": "TERMINAL",
                "managed_type": "edu.kit.datamanager.repo.domain.ContentInformation",
                "author": "SELF",
                "commit_date": "2023-12-06 19:03:29.858"
            },
            {
                "id": 5,
                "type": "TERMINAL",
                "managed_type": "edu.kit.datamanager.repo.domain.ContentInformation",
                "author": "SELF",
                "commit_date": "2023-12-06 19:03:29.858"
            },
            {
                "id": 6,
                "type": "TERMINAL",
                "managed_type": "edu.kit.datamanager.repo.domain.ContentInformation",
                "author": "SELF",
                "commit_date": "2023-12-06 19:03:29.858"
            },
        ];*/
    }
}


