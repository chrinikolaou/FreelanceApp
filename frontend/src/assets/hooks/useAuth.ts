import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    useEffect(()=> {
        axios
        .get("/me")
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

    return { user, authChecked };
}
