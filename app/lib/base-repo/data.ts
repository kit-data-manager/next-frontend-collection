import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {DataResource} from "@/app/lib/definitions";
import {formatCurrency} from "@/app/lib/utils";

/*export async function fetchDataResources() : Promise<DataResource[]> {
    noStore()
    try {
        const res = await fetch(`http://localhost:8081/api/v1/dataresources/`).then(function(response){
            return response.json();
        });
        console.log('Data fetch completed.');
        console.log(res);
        return res;
    } catch (error) {
        console.error('Service Error:', error);
        throw new Error('Failed to fetch data resources.');
    }
}*/

export async function fetchActuatorInfo(){
    noStore()
    try {
        console.log("Fetch");
        const res = await fetch(`http://localhost:8081/actuator/health`).then(res => res.json());

        let database = res.components.db.details.database;
        let databaseStatus = res.components.db.status;
        let harddisk = res.components.diskSpace.details.free;
        let harddiskStatus = res.components.diskSpace.status;
        let rabbitMqStatus = res.components.rabbitMQMessagingService.status;
        let rabbitMq = "unknown";
        let elasticStatus = "UNKNOWN";
        let elastic = "unknown";

        return {
            databaseStatus,
            database,
            harddiskStatus,
            harddisk,
            rabbitMqStatus,
            rabbitMq,
            elasticStatus,
            elastic
        }

    } catch (error) {
        console.error('Service Error:', error);
        throw new Error('Failed to fetch actuator info.');
    }
}

export async function fetchContentOverview() {
    noStore()
    try {
        const client = new Pool({
            user:process.env.DB_USER,
            host:process.env.DB_HOST,
            database:process.env.DB_NAME,
            password:process.env.DB_PASSWORD,
            port:process.env.DB_PORT
        })

        let uniqueUsersPromise = client.query("SELECT COUNT(DISTINCT sid) FROM acl_entry");
        let resourcesPromise = client.query("SELECT COUNT(*) FROM data_resource WHERE state IN ('VOLATILE', 'FIXED')");
        let openResourcesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, acl_entry as acl WHERE resource.state IN ('VOLATILE', 'FIXED') AND resource.id=acl.resource_id AND acl.sid='anonymousUser'");
        let closedResourcesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, acl_entry as acl WHERE resource.state IN ('VOLATILE', 'FIXED') AND resource.id=acl.resource_id AND acl.sid!='anonymousUser'");
        let filesPromise = client.query("SELECT COUNT(*) FROM data_resource as resource, content_information as content WHERE resource.id=content.parent_resource_id AND resource.state IN ('VOLATILE', 'FIXED')");
        let sizePromise = client.query("SELECT SUM(content.size) FROM data_resource as resource, content_information as content WHERE resource.id=content.parent_resource_id AND resource.state IN ('VOLATILE', 'FIXED')");

        const data = await Promise.all([
            uniqueUsersPromise,
            resourcesPromise,
            openResourcesPromise,
            closedResourcesPromise,
            filesPromise,
            sizePromise
        ]);
        const uniqueUsers = Number(data[0].rows[0].count ?? '0');
        const resources = Number(data[1].rows[0].count ?? '0');
        const openResources = Number(data[2].rows[0].count ?? '0');
        const closedResources = Number(data[3].rows[0].count ?? '0');
        const files = Number(data[4].rows[0].count ?? '0');
        const size = Number(data[5].rows[0].sum ?? '0');

        return {
            uniqueUsers,
            resources,
            openResources,
            closedResources,
            files,
            size
        };
    } catch (error) {
        console.error('Database Error:', error);
       // throw new Error('Failed to fetch content overview.');
        const uniqueUsers = 0;
        const resources = 0;
        const openResources = 0;
        const closedResources = 0;
        const files = 0;
        const size = 0;
        return {
            uniqueUsers,
            resources,
            openResources,
            closedResources,
            files,
            size
        };
    }
}

export async function fetchLatestActivities() {
    noStore()

    try {
        const client = new Pool({
            user:process.env.DB_USER,
            host:process.env.DB_HOST,
            database:process.env.DB_NAME,
            password:process.env.DB_PASSWORD,
            port:process.env.DB_PORT
        })

        const activities = await client.query(' \
            SELECT \
                sna.type, \
                sna.managed_type, \
                com.author, \
                com.commit_date \
            FROM \
                jv_snapshot as sna, \
                jv_commit as com \
            WHERE \
                com.commit_pk = sna.global_id_fk AND \
                sna.managed_type IN (\'edu.kit.datamanager.repo.domain.ContentInformation\', \'edu.kit.datamanager.repo.domain.DataResource\') \
            LIMIT 6');
        return activities.rows;
    } catch (error) {
        console.error('Database Error:', error);
        //throw new Error('Failed to fetch latest activities.');
        //return [];
        return [
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
        ];
    }
}
