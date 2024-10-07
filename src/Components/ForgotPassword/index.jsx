import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [resetSent, setResetSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: ""
    });

    const handleResetPassword = async (event) => {
        event.preventDefault();
        const Email = event.target.user.value; // Asegúrate de que el 'name' del input sea 'user'

        if (!Email.trim()) {
            toast.error('¡Ups! Ha ocurrido un error', {
                className: 'error-toast',
                description: "Por favor ingrese su correo",
                duration: 5000
            });
            return;
        }
        setLoading(true);

        try {
            const response = await fetch("/api/User/RestorePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Email }),
            });
            const data = await response.json();

            if (response.ok) {
                setResetSent(true);
            } else if(response.status >= 500 || typeof data.error === "undefined") {
                toast.error('¡Ups! Ah ocurrido un error', {
                    className: 'error-toast',
                    description: "Intentalo más tarde",
                    duration: 6000
                });
            } else {
                toast.error('', {
                    className: 'error-toast',
                    description: data.error,
                    duration: 6000
                });
            }
        } catch (error) {
            toast.error('¡Ups! Ah ocurrido un error', {
                className: 'error-toast',
                description: "Intentalo más tarde",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            {resetSent ? (
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-2xl font-semibold mb-4">Correo enviado</h2>
                    <p className="mb-4">Se ha enviado un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                    <a
                        href="/"
                        className="bg-[#864EFF] text-white font-semibold py-2 px-4 rounded hover:bg-[#572bb4] transition-[0.5]"
                    >
                        Iniciar sesión
                    </a>
                </div>
            ) : (
                <div className="w-full h-screen items-center justify-between flex flex-col bg-[#FFFFFF] md:bg-[##efefef]">
                    <div className="relative mx-auto w-full max-w-md bg-[#FFFFFF] h-screen sm:ring-1 sm:ring-gray-900/5 sm:rounded-b-3xl sm:px-10 sm:shadow-xl sm:max-h-[540px]">
                        <div className="w-full px-6 pb-8">
                            <p className="text-left py-4 ml-[-8px] inline-block">
                                <a href="/">
                                    <IoIosArrowBack size={28} className=" cursor-pointer text-[#303030] transition-[0.5] hover:text-[#a0a0a0]" />
                                </a>
                            </p>
                            <div className="text-left">
                                <h1 className="text-xl font-bold text-[#303030]">Olvidaste tu contraseña</h1>
                                <p className="text-md text-[#9e9e9e] mt-4">Por favor ingresa tu correo para restablecer tu contraseña</p>
                            </div>
                            <div className="mt-8">
                                <form onSubmit={handleResetPassword}>
                                    <div className="relative mt-6">
                                            <input type="text" name="user" id="user" placeholder="Correo" className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]" 
                                                onChange={(e) => setInputs({ ...inputs, email: e.target.value.toLowerCase() })}
                                                value={inputs.email}
                                            />
                                        <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">Correo</label>
                                    </div>
                                    <div className="mt-10">
                                        <button type="submit" className="w-full rounded-md bg-[#864EFF] px-3 py-3 text-white font-semibold hover:bg-[#572bb4] transition-[0.5] focus:bg-[#c5aaff] focus:outline-none">{loading ? "Enviando..." : "Restablecer contraseña"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-[#9e9e9e] px-6 mb-6 max-w-96 sm:mb-2">Al estar en Alejandría estás aceptando los Términos y Condiciones, y Políticas de Privacidad de Alejandría
                    </p>
                </div>
            )}
        </div>
    );
};

export { ForgotPassword as default }