import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { IoIosArrowBack } from "react-icons/io";
import authScreenAtom from "../../atoms/authAtom";
import userAtom from "../../atoms/userAtom";
import { toast } from 'sonner';
import LoadingDots from "../../Components/LoadingDots/index";

const SignupCard = () => {
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);
    const [isSingIn, setIsSingIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        userType: "Usuario",
    });

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };


    const handleSignup = async () => {
        const { name, email, username, password, userType } = inputs;
        var validUserTypes = ["Usuario", "Institución", "Inversor", "Empresa", "Emprendedor", "Creador de Contenido"];

        // Validations
        const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/; // Allows letters and spaces, no special characters, pero si tildes xd
        const usernamePattern = /^[a-z0-9_]+$/; // Lowercase letters, numbers, and underscores, no spaces
        const maxnameLength = 40;
        const maxPasswordLength = 25;

        // Check if all fields are filled
        if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
            toast.error('Todos los campos son obligatorios.', {
                className: 'error-toast',
                description: "Registrate correctamente",
                duration: 6000
            });
            return;
        }

        // Validate name
        if (!namePattern.test(name) || name.length > maxnameLength) {
            toast.error('Por favor, revisa el campo de nombre', {
                className: 'error-toast',
                description: "No debe tener números ni pasar de 40 caracteres",
                duration: 6000
            });
            return;
        }

        // Validate username (no special characters except underscores)
        if (!usernamePattern.test(username)) {
            toast.error('Por favor, revisa el campo de usuario', {
                className: 'error-toast',
                description: "El nombre de usuario solo puede contener letras, números y guiones bajos.",
                duration: 6000
            });
            return;
        }
        
        // Validate email
        if (!validateEmail(email)) {
            toast.error('Por favor, introduce un correo electrónico válido.', {
                className: 'error-toast',
                duration: 6000
            });
            return;
        }

        // Usa una nueva variable para almacenar el valor final de userType
        const finalUserType = validUserTypes.includes(userType) ? userType : "Usuario";


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
            const res = await fetch("/api/User/SignUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...inputs, finalUserType }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error("¡Ups! Ah ocurrido un error", {
                    className: "error-toast",
                    description: `${data.error}`,
                    duration: 6000,
                });
                return;
            }

            // localStorage.setItem("session-alejandria", JSON.stringify(data));
            // setUser(data);

            // toast(`Bienvenido, ${data.username}`, {
            //     className: 'success-toast',
            //     description: `Registrado correctamente`,
            //     duration: 5000
            // });
            // setAuthScreen("login");

            setRegistrationSuccess(true);

        } catch (error) {
            toast.error('¡Ups! Ah ocurrido un error', {
                className: 'error-toast',
                description: "Intentalo más tarde",
                duration: 6000
            });
        }
        finally {
            setIsSingIn(false);
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            {registrationSuccess ? (
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-2xl font-semibold mb-4">Cuenta creada exitosamente</h2>
                    <p className="mb-4">Se ha enviado un correo de confirmación de cuenta al correo registrado. Por favor, revisa tu bandeja de entrada y confirma tu cuenta para poder iniciar sesión.</p>
                    <button
                        className="bg-[#864EFF] text-white font-semibold py-2 px-4 rounded hover:bg-[#572bb4] transition-[0.5]"
                        onClick={() => setAuthScreen("login")}
                    >
                        Iniciar sesión
                    </button>
                </div>
            ) : (
                <div className="w-full h-screen items-center justify-between flex flex-col bg-[#FFFFFF] md:bg-[##efefef]">
                    <div className="relative mx-auto w-full max-w-md bg-[#FFFFFF] h-screen sm:ring-1 sm:ring-gray-900/5 sm:rounded-b-3xl sm:px-10 sm:shadow-xl sm:max-h-[540px]">
                        <div className="w-full bg-white px-6">
                            <p className="text-left py-4 ml-[-8px] inline-block">
                                <a onClick={() => setAuthScreen("login")}>
                                    <IoIosArrowBack
                                        size={28}
                                        className=" cursor-pointer text-[#303030] transition-[0.5] hover:text-[#a0a0a0]"
                                    />
                                </a>
                            </p>
                            <div className="text-left">
                                <h1 className="text-xl font-bold text-[#303030]">
                                    Regístrate en Alejandría
                                </h1>
                            </div>
                            <div className="mt-8">
                                <div className="relative mt-6">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Nombre"
                                            className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                        onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                        value={inputs.name}
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                                        Nombre
                                    </label>
                                </div>
                                <div className="relative mt-6">
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Usuario"
                                            className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                        onChange={(e) =>
                                            setInputs({ ...inputs, username: e.target.value.replace(/\s/g, '').toLowerCase() })
                                        }
                                        value={inputs.username}
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                                        Usuario
                                    </label>
                                </div>
                                <div className="relative mt-6">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Correo electrónico"
                                            className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                        onChange={(e) => setInputs({ ...inputs, email: e.target.value.toLowerCase()})}
                                        value={inputs.email}
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                                        Correo electrónico
                                    </label>
                                </div>
                                <div className="relative mt-6">
                                    <select
                                        name="userType"
                                        id="userType"
                                            className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                        value={inputs.userType}
                                        onChange={(e) => setInputs({ ...inputs, userType: e.target.value })}
                                    >
                                        <option value="Usuario">Usuario</option>
                                        <option value="Institucion">Institución</option>
                                        <option value="Inversor">Inversor</option>
                                        <option value="Empresa">Empresa</option>
                                        <option value="Emprendedor">Emprendedor</option>
                                        <option value="Creador de Contenido">Creador de Contenido</option>
                                    </select>

                                    <label htmlFor="userType" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                                        Tipo de Usuario
                                    </label>
                                </div>
                                <div className="relative mt-6">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Contraseña"
                                        className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent text-[#303030] focus:border-gray-500 focus:outline-none transition-[0.5] bg-[#FFFFFF]"
                                        onChange={(e) =>
                                            setInputs({ ...inputs, password: e.target.value })
                                        }
                                        value={inputs.password}
                                    />
                                    <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF]peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                                        Contraseña
                                    </label>
                                </div>
                                <div className="mt-10 mb-2">
                                    <button
                                        type="button"
                                        onClick={handleSignup}
                                        className="w-full rounded-md bg-[#864EFF] px-8 py-3 min-h-[48px] text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                                    >
                                        {(loading) ? < LoadingDots /> : "Registrarse"}
                                    </button>
                                </div>
                                <p className="text-center text-sm text-[#9e9e9e]">
                                    ¿Ya tienes una cuenta?
                                    <a
                                        className="font-semibold text-[#864EFF] hover:underline cursor-pointer focus:text-[#864EFF] focus:outline-none ml-[4px] transition-[0.5]"
                                        onClick={() => setAuthScreen("login")}
                                    >
                                        Iniciar sesión
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-[#9e9e9e] px-6 mb-6 max-w-96 sm:mb-2">
                        Al registrarte estás aceptando los Términos y Condiciones, y Políticas
                        de Privacidad de Alejandría
                    </p>
                </div>
            )}
        </div>
    );
};

export { SignupCard as default };
