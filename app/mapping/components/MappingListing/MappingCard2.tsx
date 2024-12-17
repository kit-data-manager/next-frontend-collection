import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {cva} from "class-variance-authority";
import {fetchMappingJobStatus} from "@/lib/mapping/client_data";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";

interface MappingCardProps {
    job: JobStatus;
    mapping?: Mapping;
}

export function MappingCard2({job, mapping}: MappingCardProps) {
    const [jobStatus, setJobStatus] = useState<Status>(job.status);
    const [jobOutput, setJobOutput] = useState<string|undefined>(job.outputFileURI);
    const [jobError, setJobError] = useState<string|undefined>(job.error);


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
    }, [jobStatus, jobOutput, jobError]);

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary",
            },
            special: {
                anonymous: "border-2 border-sky-500",
                self: "border-2 border-red-400"
            }
        },
    });
    const isOverlay = false;
    const isDragging = false;
    let icon:string = "line-md:loading-alt-loop";
    switch(jobStatus){
        case Status.RUNNING: icon = "line-md:cog-filled-loop";
        break;
        case Status.DELETED: icon = "material-symbols:delete-forever-outline";
        break;
        case Status.FAILED: icon = "material-symbols:error-outline";
        break;
        case Status.SUCCEEDED: icon = "material-symbols:check-box-outline";
    }

    const basePath: string = (process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : "");

    return (
        <Card
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                //: element.anonymous ? "anonymous" : element.self ? "self" : undefined,
            })}>
            <CardHeader>
                <CardTitle>
                    <Badge variant="nodeco">
                        <Icon icon={icon}
                              className="h-12 w-12 mr-2"/> {jobStatus}</Badge>

                </CardTitle>
                <CardDescription>{mapping?.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex text-left">
                <Button
                    variant="ghost"
                    className="p-1 -ml-2 h-auto cursor-grab">
                    <span className="sr-only">{jobStatus}</span>
                </Button>
                {jobOutput ?
                    <Link className={"underline"} href={basePath + jobOutput}>Download Result</Link>
                : "Not download available, yet."}
            </CardContent>
        </Card>
    );

}
