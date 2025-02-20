import {JobStatus, Status} from "@/lib/mapping/definitions";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify-icon/react";
import React, {useEffect, useState} from "react";
import {fetchMappingJobStatus} from "@/lib/mapping/client-data";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {stringToColour} from "@/lib/general/utils";

interface MappingCardProps {
    job: JobStatus;
    unregisterCallback:Function;
}

export function MappingCard({job, unregisterCallback}: MappingCardProps) {
    const [jobStatus, setJobStatus] = useState<Status>(job.status);
    const [jobOutput, setJobOutput] = useState<string | undefined>(job.outputFileURI);
    const [jobError, setJobError] = useState<string | undefined>(job.error);

    useEffect(() => {
        if (jobStatus != Status.SUCCEEDED && jobStatus != Status.FAILED) {
            const interval = setInterval(() => updateState(), 1000);
            return () => clearInterval(interval);
        }

        async function updateState() {
            try {
                return await fetchMappingJobStatus(job.jobId).then((result) => {
                    setJobStatus(result.status);
                    setJobOutput(result.outputFileURI);
                    setJobError(result.error);
                });
            } catch (e) {
                setJobStatus(Status.FAILED);
                setJobError(`Failed to query job status.`);
            }
        }
    }, [jobStatus, jobOutput, jobError, job.jobId]);

    let icon: string = "line-md:loading-alt-loop";
    switch (jobStatus) {
        case Status.RUNNING:
            icon = "line-md:cog-filled-loop";
            break;
        case Status.DELETED:
            icon = "material-symbols:delete-forever-outline";
            break;
        case Status.FAILED:
            icon = "material-symbols:error-outline";
            break;
        case Status.SUCCEEDED:
            icon = "material-symbols:check-box-outline";
    }

    function removeJob() {
        unregisterCallback([job.jobId]);
    }

    const basePath: string = (process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : "");

    return (
        <Card> <Icon icon={"ph:map-pin-fill"} width={"4"} height={"4"}
                     className="h-4 w-4 ml-2 mt-2" color={stringToColour(job.mappingId)}/>
            <CardHeader className={"h-2/5"}>

                <CardTitle className={"-mt-6"}>
                    <Badge variant="nodeco">
                        <Icon icon={icon} width={"8"} height={"8"}
                              className="h-8 w-8 mr-2"/>{jobStatus}</Badge>
                </CardTitle>
                <CardDescription>
                    <p title={job.file} className={"overflow-hidden text-sm truncate w-full"}>Input: {job.file}</p>
                </CardDescription>
            </CardHeader>
            <CardContent className={"h-1/5"}>
                <p title={jobError} className={"overflow-hidden text-sm truncate w-full"}>{jobError ? jobError : "No error"}</p>
            </CardContent>
            <CardFooter className={"h-2/5"}>
                <div className={"grid grid-cols-2 w-full"}>
                {jobOutput ?
                    <>
                        <Button variant={"ghost"} size={"sm"} title={"Download Job Output"} asChild>
                            <Link className={"underline justify-self-start"} href={basePath + jobOutput}>
                                <Icon icon={"material-symbols-light:download"} width={"8"} height={"8"} className="h-8 w-8 mr-2"/> </Link>
                        </Button>

                    </>
                    : "No download available, yet."}
                <Button variant={"ghost"} size={"sm"} title={"Remove Mapping Job"} className={"underline justify-self-end"} onClick={removeJob}>
                    <Icon icon={"solar:eraser-linear"} width={"8"} height={"8"} className="h-8 w-8 mr-2"/></Button>
               </div>
            </CardFooter>
        </Card>
    );

}
