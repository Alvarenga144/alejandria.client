import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { toast } from 'sonner';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);

    const logOut = async () => {
        try {
            const res = await fetch("/api/User/Logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                toast.error('¡Ups! Ah ocurrido un error', {
                    className: 'error-toast',
                    description: "Intentalo más tarde",
                    duration: 6000
                });
                return;
            }
            const data = res.json();
            localStorage.removeItem('session-alejandria');

            setUser(null);
            toast(`Sesión cerrada`, {
                className: 'success-toast',
                duration: 5000
            });
        }
        catch (error) {
            toast.error('¡Ups! Ah ocurrido un error', {
                className: 'error-toast',
                description: "Intentalo más tarde",
                duration: 6000
            });
        }
    };

    return logOut;
}

export default useLogout;