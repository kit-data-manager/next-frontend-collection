import {unstable_noStore as noStore} from "next/dist/server/web/spec-extension/unstable-no-store";
import {Pool} from "pg";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {DataResource} from "@/app/lib/definitions";
import {promises as fs} from 'fs';


export async function fetchDataResources(page: Number, size: Number) {
    noStore()
    try {
        const result = await myFetch(`http://localhost:8081/api/v1/dataresources/?page=${page - 1}&size=${size}&sort=lastUpdate,desc`);
        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Service Error:', error);
        return undefined;
    }
}

export async function loadContent(resource: DataResource) {
    const response = await myFetch("http://localhost:8081/api/v1/dataresources/" + resource.id + "/data/",
        {headers: {"Accept": "application/vnd.datamanager.content-information+json"}});

    const json = await response.json();

    resource.children = json;
    return resource;
}

export async function updateThumbState(id: string, path: string, addRemove: boolean) {
    if (addRemove) {
        console.log("Add thumb state ", id, "/data/", path);
    } else {
        console.log("Remove thumb state ", id, "/data/", path);
    }
}


export async function fetchDataResourcePages(size) {
    noStore()
    try {
        const response = await myFetch(`http://localhost:8081/api/v1/dataresources/?page=0&size=0&sort=lastUpdate,desc`)
        const rangeHeader = await response.headers.get("Content-Range");
        const totalElements = rangeHeader.substring(rangeHeader.lastIndexOf("/") + 1);
        const totalPages = Math.ceil(totalElements / size);
        return totalPages;
    } catch (error) {
        console.error('Failed to fetch resource page count. Error:', error);
        return undefined;
    }
}

export async function fetchDataResource(id: string) {
    noStore()
    try {
        const result = await myFetch(`http://localhost:8081/api/v1/dataresources/${id}`,
            {headers: {"Accept": "application/json"}});

        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Failed to fetch resource. Error:', error);
        return undefined;
    }
}

export async function fetchDataResourceEtag(id: string) {
    noStore()
    try {
        const result = await myFetch(`http://localhost:8081/api/v1/dataresources/${id}`,
            {headers: {"Accept": "application/json"}});

        const etag = await result.headers.get("ETag");

        return etag;
    } catch (error) {
        console.error('Failed to fetch resource ETag. Error:', error);
        return undefined;
    }
}

export async function loadSchema(schemaPath: string) {
    const file = await fs.readFile(process.cwd() + "/" + schemaPath, 'utf8').then(result => JSON.parse(result));
    return file;
}

export async function fetchActuatorInfo() {
    noStore()

    let database = "unknown";
    let databaseStatus = "unknown";
    let harddisk = 0;
    let harddiskStatus = "unknown";
    let rabbitMqStatus = "unknown";
    let rabbitMq = "unknown";
    let elasticStatus = "unknown";
    let elastic = "unknown";

    try {
        const response = await myFetch(`http://localhost:8081/actuator/health`);

        const json = await response.json();

        database = json.components.db.details.database;
        databaseStatus = json.components.db.status;
        harddisk = json.components.diskSpace.details.free;
        harddiskStatus = json.components.diskSpace.status;
        rabbitMqStatus = json.components.rabbitMQMessagingService.status;
        rabbitMq = "unknown";
        if (json.components.hasOwnProperty("rabbit") &&
            json.components.rabbit.hasOwnProperty("details") &&
            json.components.rabbit.details.hasOwnProperty("version")) {
            rabbitMq = json.components.rabbit.details.version;
        }
        elasticStatus = "unknown";
        elastic = "unknown";
        if (json.components.hasOwnProperty("elasticsearch") &&
            json.components.elasticsearch.hasOwnProperty("status") &&
            json.components.elasticsearch.hasOwnProperty("details") &&
            json.components.elasticsearch.details.hasOwnProperty("status")) {
            elasticStatus = json.components.elasticsearch.status;
            elastic = json.components.elasticsearch.details.status;
        }
    } catch (error) {
        console.error('Failed to fetch actuator info. Error:', error);
    }

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
}

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
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
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

export async function fetchLatestActivities() {
    noStore()

    try {
        const client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
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

class ResponseError extends Error {
    constructor(message, res) {
        super(message);
        this.response = res;
    }
}

export async function myFetch(...options) {
    const res = await fetch(...options);
    if (!res.ok) {
        throw new ResponseError('Bad fetch response', res);
    }
    return res;
}
