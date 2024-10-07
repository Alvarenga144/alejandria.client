import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import usePreviewImg from "../../Hooks/usePreviewImg.js";
import { toast } from "sonner";
import LoadingDots from "../LoadingDots/index";

const MAX_CHAR = 150;

const UpdateUserProfile = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const defaultProfilePic = "https://alejandriabetastorage.blob.core.windows.net/avatars-images/UserProfileDefaultAlejandria.jpg";
    const initialProfilePic = user.profilePic || defaultProfilePic;
    const [loading, setLoading] = useState(false);
    const [isSingIn, setIsSingIn] = useState(false);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        userType: user.userType,
    });

    // Opciones estándar para userType
    const [userTypeOptions, setUserTypeOptions] = useState([
        "Usuario",
        "Institucion",
        "Inversor",
        "Empresa",
        "Emprendedor",
        "Creador de Contenido",
    ]);

    // Añade el userType actual a las opciones si no está entre ellas
    useEffect(() => {
        if (!userTypeOptions.includes(user.userType)) {
            setUserTypeOptions(prevOptions => [...prevOptions, user.userType]);
        }
    }, [user.userType, userTypeOptions]);

    const filePicRef = useRef(null);
    const { handleImageChange, imgUrl } = usePreviewImg(initialProfilePic);

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const handleBiografiaChange = (e) => {
        const inputText = e.target.value;
        // Llama a la función que actualiza el estado con el nuevo valor
        setInputs({ ...inputs, bio: inputText });

        // Aquí aplicas la lógica de truncamiento de texto, si es necesario
        if (inputText.length > MAX_CHAR) {
            // Si se excede el máximo de caracteres, trunca el texto
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setInputs({ ...inputs, bio: truncatedText });
        }
    };

    const handleSubmit = async () => {
        const { name, email, username, bio, userType } = inputs;

        // Validations
        const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/; // Allows letters and spaces, no special characters, pero si tildes xd
        const usernamePattern = /^[a-z0-9_]+$/; // Lowercase letters, numbers, and underscores, no spaces
        const maxnameLength = 40;

        // Check if all fields are filled
        if (!name.trim() || !email.trim() || !username.trim() || !bio.trim()) {
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

        if (isSingIn) return;
        setIsSingIn(true);
        setLoading(true);
        try {
            const res = await fetch(`api/User/UpdateUser/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...inputs, userType, profilePic: imgUrl }),
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

            setUser(data);
            localStorage.setItem("session-alejandria", JSON.stringify(data));
            toast.success("Perfil Actualizado", {
                className: "success-toast",
                description: `Perfil guardado correctamente`,
                duration: 5000,
            });

            navigate(`/${user.username}`);

        } catch (error) {
            toast.error("¡Ups! Ah ocurrido un error", {
                className: "error-toast",
                description: "Intentalo más tarde",
                duration: 6000,
            });
        } finally {
            setIsSingIn(true);
            setLoading(false);
        }
  };

  return (
      <div className="w-full h-screen items-center justify-between flex flex-col bg-[#FFFFFF] md:bg-[##efefef] dark:bg-[#151515]">
          <div className="relative mx-auto w-full max-w-md bg-[#FFFFFF] dark:bg-[#262626] h-screen sm:ring-1 sm:ring-gray-900/5 sm:rounded-b-3xl sm:px-10 sm:shadow-xl sm:max-h-[660px]">
              <div className="w-full px-6 pb-8">
                  <p className="text-left py-4 ml-[-8px] inline-block">
                      <NavLink to={`/${user.username}`}>
                          <IoIosArrowBack
                            size={28}
                              className="cursor-pointer text-[#303030] dark:text-[#FAFAFA] dark:opacity-50 transition-[0.5] hover:text-[#a0a0a0]"
                          />
                      </NavLink>
                  </p>
                  <div className="text-left">
                      <h1 className="text-xl font-bold text-[#303030] dark:text-[#FAFAFA]">Editar perfil</h1>
                  </div>
                  <div className="mt-8">
                      <div className="relative mt-6 justify-between flex gap-6">
                          <img
                              src={imgUrl || user.profilePic}
                              alt={inputs.username}
                              className="rounded-full object-cover max-w-24 max-h-24 min-w-24 min-h-24 border border-[#ADADAD]"
                          />
                          <button
                              onClick={() => filePicRef.current.click()}
                              className="w-full my-6 rounded-md bg-[#AFAFAF] dark:bg-[#464646] px-3 py-3 text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                          >
                              Editar foto
                          </button>
                          <input
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              hidden
                              ref={filePicRef}
                              onChange={handleImageChange}
                          />
                      </div>
                      <div className="relative mt-6">
                          <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Nombre"
                              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA]"
                              value={inputs.name}
                              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                          />
                          <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                              Nombre
                          </label>
                      </div>
                      <div className="relative mt-6">
                          <input
                              type="text"
                              name="username"
                              id="username"
                              placeholder="Usuario"
                              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA]"
                              value={inputs.username}
                              onChange={(e) => setInputs({ ...inputs, username: e.target.value.replace(/\s/g, '').toLowerCase() })}
                          />
                          <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                              Usuario
                          </label>
                      </div>
                      <div className="relative mt-6">
                          <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Correo electrónico"
                              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA]"
                              value={inputs.email}
                              onChange={(e) =>
                                  setInputs({ ...inputs, email: e.target.value.trim() })}
                          />
                          <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                              Correo electrónico
                          </label>
                      </div>
                      <div className="relative mt-6">
                          <input
                              type="text"
                              name="biografia"
                              id="biografia"
                              placeholder="Descripción"
                              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA]"
                              value={inputs.bio}
                              onChange={handleBiografiaChange}
                          />
                          <label className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                              Descripción
                          </label>
                      </div>
                      <div className="relative mt-6">
                          <select
                              name="userType"
                              id="userType"
                              className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 focus:border-gray-500 focus:outline-none transition-[0.5] dark:bg-[#262626] dark:text-[#FAFAFA]"
                              value={inputs.userType}
                              onChange={(e) => setInputs({ ...inputs, userType: e.target.value })}
                          >
                              {userTypeOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                              ))}
                          </select>

                          <label htmlFor="userType" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-[#AFAFAF] opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#AFAFAF] peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-[#AFAFAF]">
                              Tipo de Usuario
                          </label>
                      </div>
                      <div className="mt-10">
                          <button
                              className="w-full rounded-md bg-[#864EFF] px-8 py-3 min-h-[48px] text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                              onClick={handleSubmit}
                          >
                              {(loading) ? < LoadingDots /> : "Guardar"}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export { UpdateUserProfile as default };
