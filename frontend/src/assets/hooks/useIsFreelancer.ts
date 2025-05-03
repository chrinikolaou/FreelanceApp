import { useEffect, useState } from "react";
import api from "../../AxiosInstance";

export function useIsFreelancer() {
  const [isFreelancer, setIsFreelancer] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIsFreelancer = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/freelancer");
        setIsFreelancer(response.data);
      
      } catch (err: any) {
        setIsFreelancer(false);
        setError(err.message || "Failed to fetch.");
      } finally {
        setLoading(false);
      }
    };

    fetchIsFreelancer();
  }, []);

  return { isFreelancer, loading, error };
}
