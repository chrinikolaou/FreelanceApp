import { useEffect, useState } from 'react';
import api from '../../AxiosInstance';

interface User {
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    useEffect(()=> {
        api
        .get("/auth/me")
        .then((res)=> {
            setUser(res.data);
        })
        .catch(()=> {
            setUser(null);
        })
        .finally(() => {
            setAuthChecked(true);
        });
    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, {withCredentials: true});
        } catch(e) {
            console.warn("Logout failed, " + e);
        }
        setUser(null);
        
    }

    return { user, authChecked, logout };
}
