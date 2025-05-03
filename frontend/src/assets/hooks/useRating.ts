import { useEffect, useState } from 'react';
import api from '../../AxiosInstance';
import { Rating } from '../models/Rating';

export function useRating(completedJobId?: number) {
    const [rating, setRating] = useState<Rating>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get<Rating>(`/ratings/completedJob/${completedJobId}`);
                setRating(response.data);
            } catch (err: any) {
                console.warn(err.response?.data || 'Failed to fetch rating.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { rating, loading };
}
