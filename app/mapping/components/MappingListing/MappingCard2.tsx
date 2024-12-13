import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {cva} from "class-variance-authority";
import {fetchMappingJobStatus} from "@/lib/mapping/client_data";

interface MappingCardProps {
    job: JobStatus;
    mapping: Mapping;
    reloadCallback: Function;
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
    }, [updateState, jobStatus, jobOutput, jobError]);

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

    return (
        <Card
            className={variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
                //: element.anonymous ? "anonymous" : element.self ? "self" : undefined,
            })}>
            <CardHeader>
                <CardTitle>{mapping.title} {jobStatus}</CardTitle>
                <CardDescription>{mapping.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex items-center align-middle text-left whitespace-pre-wrap">
                <Button
                    variant="ghost"
                    className="p-1 -ml-2 h-auto cursor-grab">
                    <span className="sr-only">{jobStatus}</span>
                    <Icon fontSize={24} icon={"ic:baseline-announcement"}
                          className="h-6 w-6 mr-2"/>
                </Button>
                {jobOutput}
            </CardContent>
        </Card>
    );

}
