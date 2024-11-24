'use client';

import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {JobStatus, Mapping} from "@/lib/mapping/definitions";
import {fetchMappings} from "@/lib/mapping/client_data";
import MappingCard from "@/app/mapping/components/MappingCard/MappingCard";
import useUserPrefs from "@/lib/hooks/userUserPrefs";
import {useRouter} from "next/navigation";
import MappingCard2 from "@/app/mapping/components/MappingCard/MappingCard2";

export default function MappingListing2({page,size, filter, sort}: {
    page: number;
    size: number;
    filter: FilterForm;
    sort:string;
}) {
    const [mappings, setMappings] = useState(undefined as unknown as Mapping[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const { data, status } = useSession();
    const accessToken = data?.accessToken;
    const { userPrefs, updateUserPrefs } = useUserPrefs(data?.user.id);
    const router = useRouter();

    useEffect(() => {
        if(status != "loading"){
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

    if (status === "loading" || isLoading || !mappings){
        return ( <Loader/> )
    }

    if(mappings.length === 0){
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/mapping/map"})
    }

    function registerJob(mappingId: string, status:JobStatus){
        console.log("Register new MappingJob ", mappingId, status);

        let copy:Map<string, JobStatus[]>
        if(!userPrefs.mappingJobs){
            copy = new Map();
        }else{
            copy = new Map(JSON.parse(userPrefs.mappingJobs));
        }

        let newMap:boolean = true;
        copy.forEach((elems:JobStatus[], key:string)=> {
            if(key === mappingId){
                newMap = false;
                let newJob:boolean = true;
                elems.map((job: JobStatus, idx:number) => {
                    if(job.jobId === status.jobId){
                        newJob = false;
                    }
                });
                if(newJob){
                    elems.push(status);
                }
            }else{
                copy.set(key, [...elems] as JobStatus[]);
            }
        });

        if(newMap){
            copy.set(mappingId, [status]);
        }
        const asString = JSON.stringify(Array.from(copy.entries()));
        console.log("Updating to ", {mappingJobs: asString});
        updateUserPrefs({mappingJobs: asString});
        console.log("Updated to ", {mappingJobs: asString});
        router.push("/mapping/map");
    }

    function unregisterJob(mappingId: string, jobId: string){
        console.log("Unregister MappingJob ", jobId);

        let copy:Map<string, JobStatus[]>
        if(!userPrefs.mappingJobs){
            copy = new Map();
        }else{
            copy = new Map(JSON.parse(userPrefs.mappingJobs));
        }

        copy.forEach((elems:JobStatus[], key:string)=> {
            if(key === mappingId){
                let removeIndex:number = -1;
                elems.map((job: JobStatus, idx:number) => {
                    if(job.jobId === jobId){
                        removeIndex = idx;
                    }
                });
                if(removeIndex > -1){{
                    copy.set(key, [...elems.splice(removeIndex, 1)] as JobStatus[]);
                }

                }
            }else{
                copy.set(key, [...elems] as JobStatus[]);
            }
        });

        const asString = JSON.stringify(Array.from(copy.entries()));
        updateUserPrefs({mappingJobs: asString});
    }

    return (
        <div className="mt-5 grid  w-full">
            <div className="rounded-lg p-4 lg:pt-0 flex-fill">
                    {mappings?.map((element:Mapping, i:number) => {
                        //make edit optional depending on permissions
                        const actionEvents:ActionButtonInterface[] = [
                        ];

                        actionEvents.push({label: "View Mapping", iconName:"material-symbols-light:eye-tracking-outline", eventIdentifier: `view`,  tooltip: "View the Mapping File."} as ActionButtonInterface);
                        actionEvents.push({label: "Run", iconName:"material-symbols-light:autoplay", eventIdentifier: `run`,  tooltip: "Execute the Mapping."} as ActionButtonInterface);

                        return (
                            <div key={element.mappingId}>
                            <MappingCard2
                                key={element.mappingId}
                                data={element}
                                jobRegistrationCallback={registerJob}
                                jobUnregistrationCallback={unregisterJob}
                                userPrefs={userPrefs}
                                updateUserPrefs={updateUserPrefs}
                                actionEvents={actionEvents}
                            ></MappingCard2>
                            </div>
                        );
                    })}
            </div>


            <div className="mt-5 flex w-full justify-center">
                {totalPages ?
                <Pagination totalPages={totalPages}/>:null}
            </div>
        </div>
    );
}
