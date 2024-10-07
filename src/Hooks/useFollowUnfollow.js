import { useState } from 'react';
import { toast } from 'sonner';
import { useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';

const useFollowUnfollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers?.includes(currentUser?._id) ?? false);
    const [updating, setUpdating] = useState(false);

    const handleFollow = async () => {
        if (!currentUser) {
            toast(`Registrate en Alejandría`, {
                className: 'success-toast',
                duration: 5000
            });
            return;
        }

        if (updating) return;
        setUpdating(true);

        try {
            const res = await fetch(`/api/User/Follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: `Rercaga la pantalla`,
                    duration: 6000,
                });
                return;
            }
            
            if (following) {
                user.followers.pop();
                toast(`Dejaste de seguir a ${user.username}`, {
                    className: 'success-toast',
                    duration: 5000
                });
            } else {
                user.followers.push(currentUser?._id);
                toast(`Siguiendo a ${user.username}`, {
                    className: 'success-toast',
                    duration: 5000
                });
            }
            setFollowing(!following);
        } catch (error) {
            toast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                description: `Intentalo mas tarde`,
                duration: 6000,
            });
        } finally {
            setUpdating(false);
        }
    };

    return { handleFollow, updating, following };
}

export { useFollowUnfollow as default }