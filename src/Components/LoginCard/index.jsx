import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from "recoil";
import AlejandriaLogoWhite from "../../assets/AlejandriaLogoWhite.png";
import authScreenAtom from "../../atoms/authAtom";
import userAtom from '../../atoms/userAtom';
import { toast } from 'sonner';
import LoadingDots from "../../Components/LoadingDots/index";

const LoginCard = () => {
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const [isSingIn, setIsSingIn] = useState(false);
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    const handleLogin = async () => {
        const { username, password } = inputs;

        // Validations
        const maxPasswordLength = 25;

        // Check if all fields are filled
        if (!username.trim() || !password.trim()) {
            toast.error('Todos los campos son obligatorios.', {
                className: 'error-toast',
                description: "Registrate correctamente",
                duration: 6000
            });
            return;
        }

        // Validate password length
        if (password.length > maxPasswordLength) {
            toast.error('Por favor, revisa el campo de contraseña', {
                className: 'error-toast',
                description: `La contraseña no puede tener más de ${maxPasswordLength} caracteres.`,
                duration: 6000
            });
            return;
        }
        if (isSingIn) return;
        setIsSingIn(true);
        setLoading(true);

        try {
            const res = await fetch("/api/User/Login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();

            if (!res.ok) {
                toast('Acceso denegado', {
                    description: `${data.error}`,
                    duration: 60000
                });
                return;
            }

            localStorage.setItem("session-alejandria", JSON.stringify(data));
            setUser(data);
            
            toast(`Bienvenido, ${data.username}`, {
                className: 'success-toast',
                duration: 5000
            });
        }
        catch (error) {
            toast.error('¡Ups! Ah ocurrido un error', {
                className: 'error-toast',
                description: "Intentalo más tarde",
                duration: 10000
            });
        } finally {
            setLoading(false);
            setIsSingIn(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className="w-full h-screen items-center justify-between flex flex-col bg-[#FFFFFF] md:bg-[##efefef]">
            <div className="relative mx-auto w-full max-w-md bg-[#FFFFFF] h-screen sm:ring-1 sm:ring-gray-900/5 sm:rounded-b-3xl sm:px-10 sm:shadow-xl sm:min-h-[568px] sm:max-h-[70px]">

                <div className="w-full text-center mb-10 py-10 rounded-b-3xl bg-gradient-to-t from-[#110036] to-[#864EFF] shadow-xl sm:py-4">
                    <img src={AlejandriaLogoWhite} alt="Alejandria" className="mx-auto w-24 my-2" />
                    <p className="text-2xl font-bold text-[#FAFAFA] pt-4 pb-8 px-4">¡Bienvenido a Alejandr<span className="text-[#F5D110]">ía</span>!</p>
                    {/*<p className="text-xl font-semibold text-[#CCCCCC] mx-auto max-w-[224px]">El lugar donde las ideas cobran vida</p>*/}
                </div>
                <div className="w-full px-6 pb-2 bg-white z-10">
                    <div className="text-left">
                        <h1 className="text-xl font-bold text-[#303030]">Iniciar sesión</h1>
                    </div>
                    <div className="mt-5">
                        <div className="relative mt-6">
                            <input type="text" name="username" id="username" placeholder="Usuario o correo"
                                className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                                value={inputs.username}
                            />
                            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">Usuario o correo</label>
                        </div>
                        <div className="relative mt-6">
                            <input type="password" name="password" id="password" placeholder="Contraseña"
                                className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                onKeyDown={handleKeyDown}
                                value={inputs.password}
                            />
                            <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">Contraseña</label>
                        </div>
                        <p className="text-right text-sm mt-2">
                            <NavLink to="/restoreKeys"
                                className="font-semibold text-[#864EFF] hover:underline focus:text-[#864EFF] focus:outline-none transition-[0.5]">¿Olvidaste tu contraseña?
                            </NavLink>
                        </p>
                        <div className="mt-6 mb-2">
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="w-full rounded-md bg-[#864EFF] px-8 py-3 min-h-[48px] text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                            >
                                {(loading) ? < LoadingDots /> : "Iniciar sesión"}
                            </button>
                        </div>
                        <p className="text-center text-sm text-[#9e9e9e]">¿Nuevo en Alejandría?
                            <a
                                className="font-semibold text-[#864EFF] hover:underline cursor-pointer focus:text-[#864EFF] focus:outline-none ml-[4px] transition-[0.5]"
                                onClick={() => setAuthScreen("signup")}
                            >
                                Crear cuenta
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-[#9e9e9e] px-2 mb-6 max-w-96 sm:mb-2"> &copy; {new Date().getFullYear()} Alejandría. Todos los derechos reservados. Leadland Company Registered.
            </p>
        </div>
    );
}

export { LoginCard as default }