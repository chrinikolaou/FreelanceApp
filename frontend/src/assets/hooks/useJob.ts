import { useEffect, useState } from "react";
import {Job} from '../models/Job';
import api from '../../AxiosInstance';

export function useJob(id: string | undefined) {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        if(!id) return;
        setLoading(true);
        api.get<Job>(`/jobs/view/${id}`)
        .then(res=>setJob(res.data))
        .catch(err=>{
            console.error(err);
            setError("Failed to fetch job.");
        })
        .finally(()=>setLoading(false));
    }, [id]);

    return {job, loading, error};
}


