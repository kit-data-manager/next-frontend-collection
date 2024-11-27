'use client';

import {AlertCircle, RefreshCw} from "lucide-react"
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {deleteMappingJobStatus, fetchMappingJobStatus, fetchMappings} from "@/lib/mapping/client_data";
import {useRouter} from "next/navigation";
import MappingCard from "@/app/mapping/components/MappingCard/MappingCard";
import {Button} from "@/components/ui/button";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

export default function MappingListing({page, size, filter, sort}: {
    page?: number;
    size?: number;
    filter?: FilterForm;
    sort?: string;
}) {
    const maxJobs: number = process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS ? Number.parseInt(process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS) : 20;

    const [mappings, setMappings] = useState(undefined as unknown as Mapping[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
    const {data, status} = useSession();
    const accessToken = data?.accessToken;
    const jobStore: JobStore = useMappingStore.getState();
    const router = useRouter();

    useEffect(() => {
        if (status != "loading") {
            setIsLoading(true);
            fetchMappings(page?page:0, size?size:20, filter, sort, accessToken).then((page) => {
                setTotalPages(page.totalPages);
                setMappings(page.resources);
                setIsLoading(false);
            })
        }

        setShowAlert(jobStore.mappingStatus.length > maxJobs);

    }, [page, size, filter, sort, status, accessToken])

    if (status === "loading" || isLoading || !mappings) {
        return (<Loader/>)
    }

    if (mappings.length === 0) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/mapping/map"})
    }

    function registrationCompleted() {
        //reload to show jobs in UI
        router.push("/mapping/map");
    }

    function registerJob(mappingId: string, status: JobStatus) {
        console.log("Register new MappingJob ", mappingId, status);
        status.mappingId = mappingId;
        jobStore.addJob(status);
    }

    function unregisterJobs(jobIds: string[]) {
        console.log("Unregister MappingJobs ", jobIds);
        jobIds.map((jobId) => {
            deleteMappingJobStatus(jobId).finally(() => {
                jobStore.removeJob(jobId);
            })
        })
    }

    async function getJobStatus(job: JobStatus) {
        try {
            return await fetchMappingJobStatus(job.jobId);
        } catch (e) {
            job.status = Status.FAILED;
            return job;
        }
    }

    const doCheckJobs = async () => {
        checkJobs();
    }

    async function checkJobs() {
        console.log("Checking mapping jobs... ", jobStore.mappingStatus);

        if (jobStore.mappingStatus.length > 0) {
            const promises = [] as Promise<any>[];
            promises.push(Promise.all(jobStore.mappingStatus.map((job: JobStatus, idx: number) => {
                if (job.status === Status.RUNNING || job.status === Status.SUBMITTED) {
                    return getJobStatus(job);
                }
                return job;
            })).then(jobs => {
                jobs.forEach((job: JobStatus, idx: number) => {
                    jobStore.updateJob(job)
                })
            }));

            Promise.all(promises).then(() => {
                router.push("/mapping/map");
            });
        }
    }


    return (
        <div className="mt-5 grid w-full">
            <Alert variant="destructive" hidden={!showAlert}>
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Too many jobs</AlertTitle>
                <AlertDescription>
                    You have to many mapping jobs active. Thus, no more mappings can be executed. Please remove some jobs manually or cleanup succeeded and failed jobs automatically.
                </AlertDescription>
            </Alert>
            <div className="p-4 grid">
                <div className="justify-items-end">
                    <div className="flex space-x-2 justify-content-right">
                        <Button onClick={doCheckJobs} variant="outline">
                            <RefreshCw className="mr-4"/> Reload Job Status
                        </Button>
                    </div>
                </div>

            </div>
            <div className="rounded-lg p-4 lg:pt-0 flex-fill">
                {mappings?.map((element: Mapping, i: number) => {
                    //make edit optional depending on permissions
                    const actionEvents: ActionButtonInterface[] = [];

                    actionEvents.push({
                        label: "Cleanup Jobs",
                        iconName: "material-symbols-light:delete-outline",
                        eventIdentifier: `cleanup`,
                        tooltip: "Cleanup finished and failed jobs."
                    } as ActionButtonInterface);
                    actionEvents.push({
                        label: "View Mapping",
                        iconName: "material-symbols-light:eye-tracking-outline",
                        eventIdentifier: `view`,
                        tooltip: "View the Mapping File."
                    } as ActionButtonInterface);

                    if (jobStore.mappingStatus.length <= maxJobs) {
                        actionEvents.push({
                            label: "Run",
                            iconName: "material-symbols-light:autoplay",
                            eventIdentifier: `run_${element.mappingId}`,
                            tooltip: "Execute the Mapping."
                        } as ActionButtonInterface);
                    }

                    return (
                        <div key={element.mappingId}>
                            <MappingCard
                                key={element.mappingId}
                                data={element}
                                jobRegistrationCallback={registerJob}
                                jobRegistrationCompleteCallback={registrationCompleted}
                                jobUnregistrationCallback={unregisterJobs}
                                actionEvents={actionEvents}
                            ></MappingCard>
                        </div>
                    );
                })}
            </div>


            <div className="mt-5 flex w-full justify-center">
                {totalPages ?
                    <Pagination totalPages={totalPages}/> : null}
            </div>
        </div>
    );
}
