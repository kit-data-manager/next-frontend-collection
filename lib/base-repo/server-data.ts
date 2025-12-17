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

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.REPO_DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

    const results = await Promise.allSettled([
        pool.query("SELECT COUNT(DISTINCT sid) FROM acl_entry"),
        pool.query("SELECT COUNT(*) FROM data_resource WHERE state IN ('VOLATILE', 'FIXED')"),
        pool.query(`
    SELECT COUNT(*) 
    FROM data_resource resource
    JOIN acl_entry acl ON resource.id = acl.resource_id
    WHERE resource.state IN ('VOLATILE', 'FIXED')
    AND acl.sid = 'anonymousUser'
  `),
        pool.query(`
    SELECT COUNT(*)
    FROM data_resource resource
    JOIN content_information content ON resource.id = content.parent_resource_id
    WHERE resource.state IN ('VOLATILE', 'FIXED')
  `),
        pool.query(`
    SELECT SUM(content.size)
    FROM data_resource resource
    JOIN content_information content ON resource.id = content.parent_resource_id
    WHERE resource.state IN ('VOLATILE', 'FIXED')
  `),
    ]);

    if (results[0].status === "fulfilled") {
        uniqueUsers = Number(results[0].value.rows[0].count ?? 0);
    }

    if (results[1].status === "fulfilled") {
        resources = Number(results[1].value.rows[0].count ?? 0);
    }

    if (results[2].status === "fulfilled") {
        openResources = Number(results[2].value.rows[0].count ?? 0);
    }

    if (results[3].status === "fulfilled") {
        files = Number(results[3].value.rows[0].count ?? 0);
    }

    if (results[4].status === "fulfilled") {
        size = Number(results[4].value.rows[0].sum ?? 0);
    }

    closedResources = resources - openResources;

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

export async function fetchLatestActivities(): Promise<Activity[]> {
    noStore()
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.REPO_DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT)
        })


        const results = await Promise.allSettled([
            pool.query(' \
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
            ORDER BY com.commit_date DESC LIMIT 10')
        ]);

        if (results[0].status === "fulfilled") {
            return results[0].value.rows as Activity[] ?? [] as Activity[];
        }

        return [] as Activity[];
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

