import api from '../../AxiosInstance';
import { useEffect, useState } from 'react';
import { Rating } from '../models/Rating';

export function useMySentRatings() {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        const fetchRatings = async () => {
            try {
                setLoading(true);
                const response = await api.get<Rating[]>("/ratings/sent");
                setRatings(response.data);
            }
            catch(err: any) {
                setError(err.message || "An error occured while fetching ratings.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, []);

    return {ratings, loading, error};

}