import {JobStatus, Status} from "@/lib/mapping/definitions";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify-icon/react";
import React, {useEffect, useState} from "react";
import {fetchMappingJobStatus} from "@/lib/mapping/client-data";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {cn, stringToColour} from "@/lib/general/utils";

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
        <Card className="p-3 space-y-2 h-fit self-start bg-card">
            {/* Top row: pin + status */}

            <div className="flex items-center justify-between">
                {/* Left side grows */}
                <div className="flex items-center gap-2 flex-1">
                    <Icon
                        icon="tabler:transform-filled"
                        width={18}
                        height={18}
                        className="h-4 w-4"
                        style={{ color: stringToColour(job.mappingId) }}
                        title={`Used Mapping: ${job.mappingId}`}
                    />

                    <Badge
                        className={cn(
                            "flex w-full text-primary-foreground",
                            {
                                "bg-secondary hover:bg-secondary": jobStatus === Status.SUBMITTED,
                                "bg-destructive hover:bg-destructive": jobStatus === Status.FAILED,
                                "bg-info hover:bg-info": jobStatus === Status.RUNNING,
                                "bg-success hover:bg-success text-primary": jobStatus === Status.SUCCEEDED,
                            }
                        )}
                    >
                        <Icon icon={icon} width={20} height={20} className="h-5 w-5" />
                        {jobStatus}
                    </Badge>
                </div>

                {/* Right side stays fixed */}
                <Button
                    variant="ghost"
                    size="icon"
                    title="Remove Mapping Job"
                    onClick={removeJob}
                >
                    <Icon
                        icon="solar:eraser-linear"
                        width={20}
                        height={20}
                        className="h-5 w-5 text-primary-foreground"
                    />
                </Button>
            </div>


            {/* Input file */}
            <p
                title={job.file}
                className="text-sm text-muted-foreground truncate"
            >
                <span className="font-medium text-primary-foreground">Input:</span> {job.file}
            </p>

            {/* Error / status message */}
            <p
                title={jobError}
                className={`text-sm truncate ${
                    jobError ? "text-destructive" : "text-muted-foreground"
                }`}
            >
                {jobError || "No error"}
            </p>

            {/* Footer actions */}
            <div className="flex justify-between items-center pt-1">
                {jobStatus === Status.SUCCEEDED ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        title="Download Job Output"
                        className="gap-1 bg-accent text-primary-foreground"
                    >
                        <Link href={basePath + jobOutput}>
                            <Icon
                                icon="material-symbols-light:download"
                                width={20}
                                height={20}
                            />
                            Download
                        </Link>
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">
        No download available
      </span>
                )}
            </div>
        </Card>
    );

}
