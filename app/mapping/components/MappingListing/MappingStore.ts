import {create} from 'zustand'
import {JobStatus} from "@/lib/mapping/definitions";
import {createJSONStorage, persist} from "zustand/middleware";

export interface JobStore {
    mappingStatus: JobStatus[];
    addJob: Function;
    removeJob: Function;
    updateJob: Function;
}

const useMappingStore = create<JobStore>()(
    persist(
        (set) => ({
            mappingStatus: [],
            addJob: (job: JobStatus) =>
                set((state) => ({
                    mappingStatus: [...state.mappingStatus as JobStatus[], job as JobStatus],
                })),
            removeJob: (jobId: string) =>
                set((state) => ({
                    mappingStatus: state.mappingStatus.filter((job: JobStatus) => job.jobId !== jobId),
                })),
            updateJob: (job: JobStatus) =>
                set((state) => ({
                    mappingStatus: state.mappingStatus.map((old: JobStatus) => {
                        if (old.jobId === job.jobId) {
                            old.status = job.status;
                            old.error = job.error;
                            old.outputFileURI = job.outputFileURI;
                        }
                        return old;
                    }),
                }))
        }),
        {
            name: "mappingJobs",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

/*
const useMappingStore = create<JobStore>((set) => ({
        mappingStatus: [] as JobStatus[],
    addJob: (job: JobStatus) =>
        set((state) => ({
            mappingStatus: [...state.mappingStatus as JobStatus[], job as JobStatus],
        })),
    removeJob: (jobId: string) =>
        set((state) => ({
            mappingStatus: state.mappingStatus.filter((job: JobStatus) => job.jobId !== jobId),
        })),
    updateJob: (job: JobStatus) =>
        set((state) => ({
            mappingStatus: state.mappingStatus.map((old: JobStatus) => {
                if (old.jobId === job.jobId) {
                    old.status = job.status;
                    old.error = job.error;
                    old.outputFileURI = job.outputFileURI;
                }
                return old;
            }),
        }))
    }
))*/

export default useMappingStore;

