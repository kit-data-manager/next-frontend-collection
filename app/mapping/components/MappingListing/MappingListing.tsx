'use client'

import useUserPrefs from "@/lib/hooks/userUserPrefs";
import React, {useEffect, useState} from "react";
import {JobStatus, Mapping} from "@/lib/mapping/definitions";
import {useSession} from "next-auth/react";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {deleteMappingJobStatus, fetchMappingPlugins, fetchMappings} from "@/lib/mapping/client_data";
import Loader from "@/components/general/Loader";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TriangleAlert} from "lucide-react";
import {MappingCard} from "@/app/mapping/components/MappingCard/MappingCard";
import {NewJobCard} from "@/app/mapping/components/MappingCard/NewJobCard";
import {AddMappingJobDialog} from "@/app/mapping/components/MappingListing/dialogs/AddMappingJobDialog";
import {Icon} from "@iconify/react";
import {ClearJobsCard} from "@/app/mapping/components/MappingCard/ClearJobsCard";
import {MappingHelp} from "@/app/mapping/components/MappingListing/help/MappingHelp";

interface MappingListing2Props {
}

export function MappingListing({}: MappingListing2Props) {
    const maxJobs: number = process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS ? Number.parseInt(process.env.NEXT_PUBLIC_MAPPING_MAX_JOBS) : 20;

    const [mappings, setMappings] = useState(undefined as unknown as Mapping[]);
    const [isLoading, setIsLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const {data, status} = useSession();
    const accessToken = data?.accessToken;
    const jobStore: JobStore = useMappingStore.getState();
    const [forceReload, setForceReload] = useState(false)
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    useEffect(() => {
        setForceReload(false);
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

        setShowAlert(jobStore.mappingStatus.length > maxJobs);
    }, [status, accessToken, forceReload, showAlert])

    if (status === "loading" || isLoading || !mappings) {
        return (<Loader/>)
    }

    function unregisterJobs(jobIds: string[]) {
        console.log("Unregister MappingJobs ", jobIds);
        jobIds.map((jobId) => {
            deleteMappingJobStatus(jobId).then((result) => {
                if (result) {
                    jobStore.removeJob(jobId);
                } else {
                    console.log("Job not deleted. Local removal skipped.");
                }
            })
        })
        setForceReload(true);
    }

    function unregisterAllJobs(){
        console.log("Unregisterin all MappingJobs");
        jobStore.mappingStatus.map((job) => {
            deleteMappingJobStatus(job.jobId).then((result) => {
                if (result) {
                    jobStore.removeJob(job.jobId);
                } else {
                    console.log("Job not deleted. Local removal skipped.");
                }
            })
        })
        setForceReload(true);
    }

    function addJobDialogClosed() {
        setOpenModal(false);
    }

    function doOpenModal() {
        setOpenModal(true);
    }

    function mappingJobAdded(mappingId: string, file: string, status: JobStatus) {
        console.log("Register new MappingJob ", mappingId, status);
        status.mappingId = mappingId;
        status.file = file;
        jobStore.addJob(status);
        setShowAlert(jobStore.mappingStatus.length + 1 > maxJobs);
    }

    function allUploadsCompleted() {
        console.log("All Uploads Completed");
        setOpenModal(false);
    }

    return (
        <div className="mt-5 grid w-full">
            <button onClick={() => updateUserPrefs({helpVisible: !userPrefs.helpVisible})}
                    title={"Show/Hide Help"}
                    className={"justify-self-end mb-2"}>
                <Icon
                    fontSize={24}
                    icon={"material-symbols-light:help-outline"}
                    className={"h-8 w-8 mr-2"}
                    style={userPrefs.helpVisible ? {color: "#0F0"} : {color: "#F00"}}
                />
            </button>

            {userPrefs.helpVisible ?
                <MappingHelp/>
                : undefined}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5  gap-2 lg:pt-0 flex-fill mt-4">
                {!showAlert ? (
                        <div className={""}>
                            <NewJobCard addJobCallback={doOpenModal}></NewJobCard>
                        </div>
                    ) :
                    <Alert className={"text-error bg-card"}>
                        <TriangleAlert color="#e20808" className="h-4 w-4 error"/>
                        <AlertTitle>Maximum Number of Jobs Reached</AlertTitle>
                        <AlertDescription>
                            You reached the maximum number of registered mapping jobs ({maxJobs}). Please remove some
                            finished or failed jobs in order
                            to be able to submit new jobs.
                        </AlertDescription>
                    </Alert>
                }
                {jobStore.mappingStatus.map((job: JobStatus, i: number) => {
                    return (
                        <MappingCard key={job.jobId} job={job} unregisterCallback={unregisterJobs}></MappingCard>
                    );
                })}

                {jobStore.mappingStatus.length > 4 ?
                    <div className={""}>
                        <ClearJobsCard removeJobsCallback={unregisterAllJobs}></ClearJobsCard>
                    </div>
                    : undefined}
            </div>
            <AddMappingJobDialog openModal={openModal} mappings={mappings}
                                 allUploadsFinishedCallback={allUploadsCompleted}
                                 singleUploadFinishedCallback={mappingJobAdded}
                                 dialogCloseCallback={addJobDialogClosed}/>
        </div>
    );

}
