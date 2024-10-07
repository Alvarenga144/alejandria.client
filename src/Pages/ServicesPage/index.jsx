import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { toast } from "sonner";

const ConfirmPage = () => {
    const { token } = useParams();
    const [confirmed, setConfirmed] = useState(null);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await fetch(`/api/User/ConfirmEmail/${token}`);
                const data = await response.json();

                if (response) {
                    setConfirmed(true);
                } else {
                    setConfirmed(false);
                    toast.error("¡Ups! Ah ocurrido un error", {
                        className: "error-toast",
                        description: `${data.error}`,
                        duration: 6000,
                    });
                    return;
                }
            } catch (error) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: `${error}`,
                    duration: 6000,
                });
                return;
            }
        };

        confirmEmail();
    }, [token]);

    if (confirmed === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
                {confirmed ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <p className="font-bold">¡Listo!</p>
                        <p>Su cuenta fue confirmada. Ahora puede acceder</p>
                        <NavLink to="/" className="block mt-4 text-center text-blue-500 hover:text-blue-700">
                            Iniciar sesión
                        </NavLink>
                    </div>
                ) : (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <p>No se pudo confirmar el correo</p>
                    </div>
                )}
            </div>
        </div>

    );
}

export { ConfirmPage as default };