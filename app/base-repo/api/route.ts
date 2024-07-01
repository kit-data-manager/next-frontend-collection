export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    try {
        const resource = await fetch(`http://localhost:8081/api/v1/dataresources/${id}`);
        const jsonResource = await resource.json();

        const content = await fetch("http://localhost:8081/api/v1/dataresources/" + id + "/data/",
            {headers: {"Accept": "application/vnd.datamanager.content-information+json"}});

        let jsonContent = await content.json();
        jsonResource["children"] = jsonContent;
        return Response.json({ jsonResource })
    } catch (error) {
        console.error('Service Error:', error);
        throw new Error('Failed to fetch data resource.');
    }
}
