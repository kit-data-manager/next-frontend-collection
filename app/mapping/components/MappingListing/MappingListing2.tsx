'use client'

import {DataResource} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import React, {useEffect, useState} from "react";
import {JobStatus, Mapping, Status} from "@/lib/mapping/definitions";
import {useSession} from "next-auth/react";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {useRouter} from "next/navigation";
import {
    deleteMappingJobStatus,
    fetchMappingJobStatus,
    fetchMappingPlugins,
    fetchMappings
} from "@/lib/mapping/client_data";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import MappingCard from "@/app/mapping/components/MappingCard/MappingCard";
import {MappingCard2} from "@/app/mapping/components/MappingListing/MappingCard2";
import {NewJobCard} from "@/app/mapping/components/MappingListing/NewJobCard";
import {AddMappingJobDialog} from "@/app/mapping/components/MappingListing/dialogs/AddMappingJobDialog";
import {mimeTypeToExtension} from "@/lib/fileUtils";

interface MappingListing2Props {
    userPrefs: UserPrefsType;
    reloadCallback: Function;
}

export function MappingListing2({userPrefs, reloadCallback}: MappingListing2Props) {
    const maxJobs: number = process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS ? Number.parseInt(process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS) : 20;

    const [mappings, setMappings] = useState(undefined as unknown as Mapping[]);
    const [isLoading, setIsLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
    const [openModal,setOpenModal] = useState(false)
    const {data, status} = useSession();
    const accessToken = data?.accessToken;
    const jobStore: JobStore = useMappingStore.getState();
    const router = useRouter();

    useEffect(() => {
        if (status != "loading") {
            setIsLoading(true);
            fetchMappings(0, 20, undefined, undefined, accessToken).then((page) => {
                return page.resources;
            }).then((mappings) => {
                fetchMappingPlugins(data?.accessToken).then(plugins => {
                    mappings.map((mapping) => {
                       mapping.plugin = plugins.find((plugin) => mapping.mappingType === plugin.id);

                    });

                    setIsLoading(false);
                    setMappings(mappings);
                });
            })
        }

        //setShowAlert(jobStore.mappingStatus.length > maxJobs);
    }, [status, accessToken])

    if (status === "loading" || isLoading || !mappings) {
        return (<Loader/>)
    }

    /*if (jobStore.mappingStatus.length === 0) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/mapping/map"})
    }*/

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

    function addMappingCallback(success:boolean){
        setOpenModal(false);
    }

    function doOpenModal(){
        setOpenModal(true);
    }

    return (
        <div className="mt-5 grid w-full">
            <div className="grid grid-cols-4 p-4 gap-2 lg:pt-0 flex-fill">
                <div className={""}>
                    <NewJobCard addJobCallback={doOpenModal}></NewJobCard>
                </div>
                {jobStore.mappingStatus.map((job: JobStatus, i: number) => {
                    const mapping = mappings.find((mapping) => mapping.mappingId === job.mappingId);
                    return (
                        <div key={job.jobId} className={""}>
                            <MappingCard2 job={job} mapping={mapping} reloadCallback={checkJobs}></MappingCard2>
                        </div>
                    );
                })}
            </div>
            <AddMappingJobDialog openModal={openModal} mappings={mappings} actionCallback={addMappingCallback}/>
        </div>
    );

}
