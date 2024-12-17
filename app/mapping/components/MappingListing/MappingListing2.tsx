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

    function unregisterJobs(jobIds: string[]) {
        console.log("Unregister MappingJobs ", jobIds);
        jobIds.map((jobId) => {
            deleteMappingJobStatus(jobId).finally(() => {
                jobStore.removeJob(jobId);
            })
        })
    }

    function addJobDialogClosed(){
        setOpenModal(false);
    }

    function doOpenModal(){
        setOpenModal(true);
    }

    function mappingJobAdded(mappingId:string, file:string, status: JobStatus){
        console.log("Register new MappingJob ", mappingId, status);
        status.mappingId = mappingId;
        status.file = file;
        jobStore.addJob(status);

    }

    function allUploadsCompleted(){
        console.log("All Uploads Completed");
        setOpenModal(false);
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
                            <MappingCard2 job={job} mapping={mapping}></MappingCard2>
                        </div>
                    );
                })}
            </div>
            <AddMappingJobDialog openModal={openModal} mappings={mappings}  allUploadsFinishedCallback={allUploadsCompleted} singleUploadFinishedCallback={mappingJobAdded} dialogCloseCallback={addJobDialogClosed}/>
        </div>
    );

}
