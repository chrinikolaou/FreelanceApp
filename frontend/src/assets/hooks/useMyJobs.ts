import { useEffect, useState } from "react";
import { Job } from "../models/Job";
import api from "../../AxiosInstance";

export function useMyJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchMyJobs = async () => {
        try {
          const response = await api.get("/jobs/me");
          setJobs(response.data);
        } catch (err: any) {
          console.error("Failed to fetch jobs:", err);
          setError(err.response?.data?.message || "Failed to fetch jobs.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchMyJobs();
    }, []);
  
    return { jobs, loading, error };
  }