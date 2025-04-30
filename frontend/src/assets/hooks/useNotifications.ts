import { useEffect, useState } from "react";
import { Notification } from "../models/Notification";
import api from '../../AxiosInstance';

export const useNotifications = (userId: number | null) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        
        const fetchNotifications = async () => {
            
            try {
                const response = await api.get<Notification[]>(`/notifications/me`);
                setNotifications(response.data);
            } catch(err: any) {
                console.error("Error fetching notifications", err);
                setError(err.message || "An error occured while fetching notifications.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [userId]);


    const markAsRead = async (id: number) => {
        try {
            await api.put(`/notifications/${id}/mark`);
            setNotifications((prev)=>
            prev.map((n)=>n.id === id ? {...n, isRead: true} : n));
        } catch(err) {
            console.error(`Failed to mark notification as read ${id}`, err);
        }
    }

    return { notifications, loading, error, markAsRead};
}