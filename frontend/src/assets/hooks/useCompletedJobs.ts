import { useState, useEffect } from "react";
import { CompletedJob } from "../models/CompletedJob";
import api from "../../AxiosInstance";

export function useCompletedJobs() {
    const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=> {

        const fetch = async () => {
            try {
                const response = await api.get("/jobs/completed");
                setCompletedJobs(response.data);
            
            } catch(error) {
                console.warn(error || "An error occured while fetching completed jobs.");
                
            }
            finally {
                setLoading(false);
            }
        }

        fetch();
    }, []);
   

    return {completedJobs, loading};

}