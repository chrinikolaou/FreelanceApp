import { useEffect, useState } from 'react';
import api from '../../AxiosInstance';
import { User, Freelancer } from '../models/Freelancer'; // Adjust import path if needed
import { Profile } from '../models/Profile';

export function useUserProfile(username?: string) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get<Profile>(`/user/${username}`);
                setProfile(response.data);
            } catch (err: any) {
                setError(err.response?.data || 'Failed to fetch user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    return { profile, loading, error };
}
