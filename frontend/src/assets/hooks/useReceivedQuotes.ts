import { useEffect, useState } from "react";
import { Quote } from "../../assets/models/Quote";
import api from "../../AxiosInstance";

export function useReceivedQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await api.get<Quote[]>("/quotes/me/jobs");
        setQuotes(response.data);
        console.log(response.data);
      
      } catch (err: any) {
        setError(err.message || "Failed to fetch your quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return { quotes, loading, error };
}
