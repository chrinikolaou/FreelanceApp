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
          const response = await api.get<boolean>(`/auth/freelancer/${username}`);
          setIsFreelancerOther(response.data);
        
        } catch (err: any) {
          setError(err.message || "Failed to fetch.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchIsFreelancer();
    }, []);
  
    return { isFreelancerOther, loading, error };
}