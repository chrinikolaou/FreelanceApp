import { useEffect, useState } from "react";
import { Job } from "../models/Job";
import api from "../../AxiosInstance";

export function useJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=> {
        api.get<Job[]>("/jobs/all")
            .then(res=>setJobs(res.data))
            .catch(console.error)
            .finally(()=>setLoading(false));
    }, []);
    return {jobs, loading};
}