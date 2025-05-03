import { useEffect, useState } from "react";
import api from "../../AxiosInstance";

export function useIsFreelancerOther(username?: string) {
    const [isFreelancerOther, setIsFreelancerOther] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchIsFreelancer = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/auth/freelancer/${username}`);
          setIsFreelancerOther(response.data);
          console.log(response.data);
        } catch (err: any) {
          setIsFreelancerOther(false);
          console.log(err.response.data);
          setError(err.message || "Failed to fetch.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchIsFreelancer();
    }, []);
  
    return { isFreelancerOther, loading, error };
}