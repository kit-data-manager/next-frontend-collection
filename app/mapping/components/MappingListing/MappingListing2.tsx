'use client';

import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {fetchMappingJobStatus, fetchMappings} from "@/lib/mapping/client_data";
import MappingCard from "@/app/mapping/components/MappingCard/MappingCard";
import useUserPrefs from "@/lib/hooks/userUserPrefs";
import {useRouter} from "next/navigation";
import MappingCard2 from "@/app/mapping/components/MappingCard/MappingCard2";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CirclePlus} from "lucide-react";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";

export default function MappingListing2({page, size, filter, sort}: {
    page: number;
    size: number;
    filter: FilterForm;
    sort: string;
}) {
    const [mappings, setMappings] = useState(undefined as unknown as Mapping[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const {data, status} = useSession();
    const accessToken = data?.accessToken;
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);
    const router = useRouter();

    useEffect(() => {
        if (status != "loading") {
            setIsLoading(true);
            fetchMappings(page, size, filter, sort, accessToken).then((page) => {
                setTotalPages(page.totalPages);
                setMappings(page.resources);
                setIsLoading(false);
            })
        }
    }, [page, size, filter, sort, status, accessToken])

    useEffect(() => {
        //setInterval(checkJobs, 3000);
    }, []);

    if (status === "loading" || isLoading || !mappings) {
        return (<Loader/>)
    }

    if (mappings.length === 0) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/mapping/map"})
    }

    function registerJob(mappingId: string, status: JobStatus) {
        console.log("Register new MappingJob ", mappingId, status);

        let copy: Map<string, JobStatus[]>
        if (!userPrefs.mappingJobs) {
            copy = new Map();
        } else {
            copy = new Map(JSON.parse(userPrefs.mappingJobs));
        }

        let newMap: boolean = true;
        copy.forEach((elems: JobStatus[], key: string) => {
            if (key === mappingId) {
                newMap = false;
                let newJob: boolean = true;
                elems.map((job: JobStatus, idx: number) => {
                    if (job.jobId === status.jobId) {
                        newJob = false;
                    }
                });
                if (newJob) {
                    elems.push(status);
                }
            } else {
                copy.set(key, [...elems] as JobStatus[]);
            }
        });

        if (newMap) {
            copy.set(mappingId, [status]);
        }
        const asString = JSON.stringify(Array.from(copy.entries()));
        checkJobs(asString);
    }

    function unregisterJob(mappingId: string, jobId: string) {
        console.log("Unregister MappingJob ", jobId);

        let copy: Map<string, JobStatus[]>
        if (!userPrefs.mappingJobs) {
            copy = new Map();
        } else {
            copy = new Map(JSON.parse(userPrefs.mappingJobs));
        }

        copy.forEach((elems: JobStatus[], key: string) => {
            if (key === mappingId) {
                let removeIndex: number = -1;
                elems.map((job: JobStatus, idx: number) => {
                    if (job.jobId === jobId) {
                        removeIndex = idx;
                    }
                });
                if (removeIndex > -1) {
                    {
                        copy.set(key, [...elems.splice(removeIndex, 1)] as JobStatus[]);
                    }
                }
            } else {
                copy.set(key, [...elems] as JobStatus[]);
            }
        });
        const asString = JSON.stringify(Array.from(copy.entries()));

        console.log("AFTER RMEOVE ", asString);

        checkJobs(asString);
    }

    async function getJobStatus(jobId: string) {
        return await fetchMappingJobStatus(jobId);
    }

    const doCheckJobs = async () => {
        checkJobs(userPrefs.mappingJobs);
    }

    async function checkJobs(jobsSerialized: string) {
        console.log("Checking mapping jobs...");
        let copy: Map<string, JobStatus[]> = new Map(JSON.parse(jobsSerialized));

        if (copy.size > 0) {
            const map2 = new Map();
            const promises = [] as Promise<any>[];

            copy.forEach((elems: JobStatus[], key: string) => {
                promises.push(Promise.all(elems.map((job: JobStatus, idx: number) => {
                    if (job.status === Status.RUNNING || job.status === Status.SUBMITTED) {
                        return getJobStatus(job.jobId);
                    }
                    return job;
                })).then(jobs => {
                    map2.set(key, jobs as JobStatus[]);
                }));
            });
            Promise.all(promises).then(() => {
                const asString = JSON.stringify(Array.from(map2.entries()));
                updateUserPrefs({mappingJobs: asString});
            });
        }
    }

    return (
        <div className="mt-5 grid w-full">
            <div className="p-4 grid grid-cols-2">
                <div className="justify-items-end">
                    <div className="flex space-x-2 justify-content-right">
                        <Button onClick={doCheckJobs} variant="outline">
                        </Button>
                    </div>
                </div>

            </div>
            <div className="rounded-lg p-4 lg:pt-0 flex-fill">
                {mappings?.map((element: Mapping, i: number) => {
                    //make edit optional depending on permissions
                    const actionEvents: ActionButtonInterface[] = [];

                    actionEvents.push({
                        label: "View Mapping",
                        iconName: "material-symbols-light:eye-tracking-outline",
                        eventIdentifier: `view`,
                        tooltip: "View the Mapping File."
                    } as ActionButtonInterface);
                    actionEvents.push({
                        label: "Run",
                        iconName: "material-symbols-light:autoplay",
                        eventIdentifier: `run_${element.mappingId}`,
                        tooltip: "Execute the Mapping."
                    } as ActionButtonInterface);

                    return (
                        <div key={element.mappingId}>
                            <MappingCard2
                                key={element.mappingId}
                                data={element}
                                jobRegistrationCallback={registerJob}
                                jobUnregistrationCallback={unregisterJob}
                                actionEvents={actionEvents}
                            ></MappingCard2>
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
