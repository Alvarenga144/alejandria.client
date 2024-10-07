import React, { useEffect, useState } from "react";
import NotificationCard from "../../Components/NotificationCard";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { toast } from "sonner";
import Navbar from "../../Components/Navbar/index";
import Layout from "../../Components/Layout"

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/Notification/UserNotifications/${user.username}`);
                if (!res.ok) {
                    const data = await res.json();
                    // toast.error("¡Ups! Ah ocurrido un error", {
                    //     className: "error-toast",
                    //     description: `${data.error}`,
                    //     duration: 6000,
                    // });
                    return;
                }
                const data = await res.json();
                setNotifications(data);
            } catch (error) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    duration: 6000,
                });
            } finally {
                setLoading(false);
            }
        };

        if (user && user.username) {
            fetchNotifications();
        }
    }, [user]);

    return (
        <>
            <Navbar />
            <Layout>
                <div className="px-1 py-2">
                    <h1 className="text-lg text-[#7439f2] font-semibold mb-4">Notificaciones</h1>
                    {loading ? (
                        <div className="text-[#7439f2] my-4 font-semibold">Cargando...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center text-gray-600 dark:text-white">No tienes notificaciones</div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))
                    )}
                </div>
            </Layout>
        </>
    );
};

export { Notifications as default };
