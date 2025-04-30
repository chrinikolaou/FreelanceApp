import { useState, useEffect } from "react";
import { Job } from "../models/Job";
import api from '../../AxiosInstance';

export function useWorkJobs() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=> {
        const fetch = async () => {
            setLoading(true);
            try {
            
                const response = await api.get("/jobs/me/work");
                setJobs(response.data);
                console.log(response.data);
            } catch(error) {
                console.warn(error.response.data || "An error occurred while fetching your work.");
            }
            finally {
                setLoading(false);
            }
        };
        
        fetch();

    }, []);

    return {jobs, loading};
}