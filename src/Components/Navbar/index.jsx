import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import MainLogo from "../../assets/mainlogo.png";
import DropDownMenu from "../DropDownMenu/index.jsx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import authScreenAtom from "../../atoms/authAtom";
import { reloadFeed$ } from '../reloadEvent.js';

const Navbar = () => {
    const [openDropMenu, setOpenDropMenu] = useState(false);
    const user = useRecoilValue(userAtom);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const dropDownMenuRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDot, setShowDot] = useState(true);
    const activeStyle = 'tu-estilo-activo';

    const handleFeedClick = () => {
        if (location.pathname === "/") {
            reloadFeed$.next();
        } else {
            navigate("/");
        }
    };

    // Para que se quite el dropdown al dar click en otro lado de la pantalla
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownMenuRef.current && !dropDownMenuRef.current.contains(event.target)) {
                setOpenDropMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setShowDot(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className="relative z-10 mx-auto w-full sticky top-0 z-10 bg-[#EFEFEF] dark:bg-[#151515] transition-[0.5]">
            <header className="sm:min-h-20 max-w-[1400px] bottom-0 static flex items-center justify-between mx-auto px-4 z-20 bg-[#EFEFEF] dark:bg-[#151515] h-12">

                {user && (
                    <NavLink to="/">
                        <div
                            className="md:flex md:justify-between md:items-center md:mx-0
                    sm:flex sm:justify-between sm:items-center sm:mx-0
                    flex items-center mx-auto"
                        >
                            <img className="w-[30px] h-[20px] sm:w-[40px] sm:h-[28px]" src={MainLogo} alt="/" />
                        </div>
                    </NavLink>
                )}

                {/* Logo without singup */}
                {!user && (
                    <NavLink to="/auth">
                        <div
                            className="md:flex md:justify-between md:items-center md:mx-0
                    sm:flex sm:justify-between sm:items-center sm:mx-0
                    flex items-center mx-auto"
                        >
                            <img className="w-[30px] h-[20px] sm:w-[40px] sm:h-[28px]" src={MainLogo} alt="/" />
                        </div>
                    </NavLink>
                )}

                {user && (
                    <ul className="desktop-list-nav z-10 sm:flex items-center hidden gap-1 ml-[-16px]">
                        <div
                            onClick={handleFeedClick}
                        >
                            <li className="text-xl py-6 px-10 rounded-xl cursor-pointer transition-[0.5] hover:bg-[#dddddd] dark:hover:bg-[#202020]">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M6.49996 7C7.96131 5.53865 9.5935 4.41899 10.6975 3.74088C11.5021 3.24665 12.4978 3.24665 13.3024 3.74088C14.4064 4.41899 16.0386 5.53865 17.5 7C20.6683 10.1684 20.5 12 20.5 15C20.5 16.4098 20.3895 17.5988 20.2725 18.4632C20.1493 19.3726 19.3561 20 18.4384 20H17C15.8954 20 15 19.1046 15 18V16C15 15.2043 14.6839 14.4413 14.1213 13.8787C13.5587 13.3161 12.7956 13 12 13C11.2043 13 10.4413 13.3161 9.87864 13.8787C9.31603 14.4413 8.99996 15.2043 8.99996 16V18C8.99996 19.1046 8.10453 20 6.99996 20H5.56152C4.64378 20 3.85061 19.3726 3.72745 18.4631C3.61039 17.5988 3.49997 16.4098 3.49997 15C3.49997 12 3.33157 10.1684 6.49996 7Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </div>
                        <NavLink
                            to="/Search"
                        >
                            <li className="text-xl py-6 px-10 rounded-xl cursor-pointer transition-[0.5] hover:bg-[#dddddd] dark:hover:bg-[#202020]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="p-[1px]">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 22L21 21" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </li>
                        </NavLink>
                        <NavLink
                            to="/BrowserAI"
                        >
                            <li className="text-xl py-6 px-10 rounded-xl cursor-pointer transition-[0.5] hover:bg-[#dddddd] dark:hover:bg-[#202020]">
                                <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    className="pt-1 pl-1"
                                >
                                    <path
                                        d="M10.486 0.0593573C8.24771 0.373871 6.42238 1.13434 4.62051 2.49098C4.13251 2.85713 2.86557 4.12927 2.49487 4.62216C1.12939 6.42945 0.359842 8.30714 0.0689146 10.5181C-0.0108556 11.1519 -0.0249327 12.6493 0.0454528 13.2971C0.125223 14.0247 0.355149 15.1185 0.538152 15.6536C0.552229 15.6912 0.669538 15.6302 0.87131 15.4799C1.04024 15.3532 1.38278 15.1467 1.62678 15.0246C1.99279 14.8368 2.06317 14.7852 2.04909 14.7054C1.74409 13.3018 1.65963 12.5367 1.70655 11.5837C1.8004 9.42437 2.51364 7.47626 3.86035 5.69245C4.22635 5.20894 5.21644 4.21846 5.69976 3.85231C7.50632 2.48628 9.44896 1.77745 11.6121 1.69295C12.6116 1.6554 13.2545 1.72581 14.7091 2.04033C14.7889 2.05441 14.8405 1.984 15.0282 1.61785C15.1502 1.37375 15.3567 1.03576 15.4833 0.862073C15.61 0.69308 15.6945 0.542864 15.6757 0.528782C15.5819 0.477145 14.4839 0.214267 13.963 0.125076C13.2169 -0.00636284 11.2039 -0.0439164 10.486 0.0593573Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M19.0965 0.341013C17.9187 0.603891 16.9333 1.39252 16.4218 2.48628C16.084 3.2092 15.9901 4.25601 16.1872 5.03995C16.4687 6.1384 17.2148 7.05848 18.219 7.54668C18.7727 7.80955 19.0777 7.88466 19.7769 7.90813C20.2836 7.92691 20.4526 7.91752 20.7951 7.83302C21.5694 7.64995 22.1559 7.30727 22.719 6.7111C23.3525 6.03513 23.6903 5.23241 23.7325 4.30765C23.7795 3.1247 23.4275 2.19993 22.6204 1.39252C22.1512 0.923099 21.7336 0.664916 21.1095 0.453675C20.7153 0.317542 20.598 0.303459 20.0349 0.289376C19.6033 0.275294 19.3029 0.29407 19.0965 0.341013Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M23.1319 8.53716C22.963 8.66391 22.6298 8.86576 22.3905 8.9925C22.0292 9.17558 21.9588 9.22722 21.9729 9.30702C22.1418 10.0957 22.2451 10.6683 22.2826 11.0861C22.6955 15.311 20.3353 19.4419 16.4453 21.3055C14.9953 22.0003 13.6111 22.3101 11.9875 22.3054C11.0678 22.3007 10.5376 22.2444 9.6742 22.0472C9.43488 21.9956 9.22842 21.958 9.21904 21.9674C9.21434 21.9721 9.1205 22.1505 9.01726 22.357C8.91403 22.5636 8.71226 22.8969 8.57149 23.094C8.42603 23.2959 8.32279 23.4649 8.34156 23.4789C8.42133 23.5259 9.73989 23.8357 10.2044 23.9155C10.6221 23.9812 10.974 24 12.0345 24C13.1841 24 13.4234 23.9859 13.9583 23.892C15.9901 23.54 17.8295 22.7326 19.4249 21.498C19.9739 21.0708 20.9077 20.1507 21.3629 19.5874C22.4187 18.2777 23.2305 16.6817 23.6434 15.0997C23.9484 13.9215 24 13.4755 24 12.0062C24 10.8139 23.9859 10.6026 23.8874 10.0581C23.7748 9.4056 23.5261 8.38695 23.4698 8.34C23.451 8.32123 23.3008 8.41511 23.1319 8.53716Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M3.14242 16.1888C2.21802 16.4282 1.41093 17.0103 0.890079 17.813C0.434919 18.5077 0.256609 19.1931 0.289456 20.0991C0.308225 20.5732 0.33638 20.7375 0.463074 21.1083C0.810309 22.1411 1.50478 22.9203 2.49018 23.3851C3.07203 23.662 3.35827 23.7183 4.15128 23.7183C4.82229 23.7137 4.8739 23.709 5.30091 23.5634C5.87338 23.3663 6.30507 23.1081 6.718 22.7185C7.30924 22.1599 7.70809 21.4745 7.86294 20.7422C7.96148 20.2728 7.9474 19.4231 7.83479 18.9725C7.71279 18.489 7.38432 17.8318 7.08401 17.4656C6.58192 16.8601 5.81707 16.3765 5.04752 16.1841C4.54074 16.0573 3.63981 16.0573 3.14242 16.1888Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </NavLink>
                        <NavLink
                            to="/Notifications"
                            className={({ isActive }) => {
                                if (isActive && showDot) {
                                    setShowDot(false);
                                }
                                return isActive ? activeStyle : undefined;
                            }}
                        >
                            <li className="text-xl py-6 px-10 rounded-xl cursor-pointer transition-[0.5] hover:bg-[#dddddd] dark:hover:bg-[#202020] relative">
                                <svg width="24px" height="22px" viewBox="0 0 24 24" fill="none">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <g id="style=doutone">
                                            <g id="notification-bell">
                                                <path id="vector (Stroke)" fillRule="evenodd" clipRule="evenodd" d="M8.87378 18.6934C9.28799 18.6934 9.62378 19.0291 9.62378 19.4434C9.62378 19.6166 9.66765 19.7955 9.76263 19.9722C9.85831 20.15 10.0063 20.3258 10.21 20.4827C10.4138 20.6396 10.6653 20.7712 10.9534 20.8631C11.2413 20.955 11.5544 21.0035 11.8734 21.0035C12.1923 21.0035 12.5054 20.955 12.7933 20.8631C13.0814 20.7712 13.3329 20.6396 13.5367 20.4827C13.7404 20.3258 13.8884 20.15 13.9841 19.9722C14.0791 19.7955 14.1229 19.6166 14.1229 19.4434C14.1229 19.0291 14.4587 18.6934 14.8729 18.6934C15.2871 18.6934 15.6229 19.0291 15.6229 19.4434C15.6229 19.8769 15.5116 20.2987 15.3051 20.6827C15.0993 21.0653 14.8054 21.3989 14.452 21.6711C14.0987 21.9431 13.6889 22.1519 13.2492 22.2922C12.8093 22.4325 12.3422 22.5035 11.8734 22.5035C11.4045 22.5035 10.9374 22.4325 10.4975 22.2922C10.0578 22.1519 9.64798 21.9431 9.29471 21.6711C8.94129 21.3989 8.64739 21.0653 8.44158 20.6827C8.23509 20.2987 8.12378 19.8769 8.12378 19.4434C8.12378 19.0291 8.45957 18.6934 8.87378 18.6934Z" fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                                                <path id="vector (Stroke)_2" fillRule="evenodd" clipRule="evenodd" d="M8.28966 2.36993C10.5476 1.24631 13.1934 1.20809 15.4828 2.26601L15.6874 2.36056C18.0864 3.46909 19.6223 5.87083 19.6223 8.51353L19.6223 9.82417C19.6223 10.8777 19.8519 11.9185 20.2951 12.8742L20.5598 13.445C21.7754 16.0663 20.1923 19.1303 17.3509 19.6555L17.2146 18.918L17.3509 19.6555L17.1907 19.6851C13.6756 20.3349 10.0711 20.3349 6.55594 19.6851C3.6763 19.1529 2.15285 15.967 3.54631 13.3914L3.77272 12.9729C4.3316 11.9399 4.62426 10.7839 4.62426 9.60942L4.62426 8.28813C4.62426 5.77975 6.04397 3.48746 8.28966 2.36993ZM14.8536 3.62766C12.9772 2.76057 10.8086 2.7919 8.95794 3.71284C7.22182 4.57679 6.12426 6.34893 6.12426 8.28813L6.12426 9.60942C6.12426 11.0332 5.76949 12.4345 5.09201 13.6867L4.86561 14.1052C3.95675 15.785 4.95039 17.863 6.82857 18.2101C10.1635 18.8265 13.5832 18.8265 16.9181 18.2101L17.0783 18.1805C18.9561 17.8334 20.0024 15.8084 19.199 14.076L18.9343 13.5053C18.3994 12.3518 18.1223 11.0956 18.1223 9.82416L18.1223 8.51353C18.1223 6.45566 16.9263 4.58543 15.0582 3.72221L14.8536 3.62766Z" fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                {showDot && (
                                    <span className="absolute top-[75%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-2 h-2 bg-[#ed4956] rounded-full"></span>
                                )}
                            </li>
                        </NavLink>
                        <NavLink
                            to={`/${user.username}`}
                        >
                            <li className="text-xl py-6 px-10 rounded-xl cursor-pointer transition-[0.5] hover:bg-[#dddddd] dark:hover:bg-[#202020]">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17.5 21.0001H6.5C5.11929 21.0001 4 19.8808 4 18.5001C4 14.4194 10 14.5001 12 14.5001C14 14.5001 20 14.4194 20 18.5001C20 19.8808 18.8807 21.0001 17.5 21.0001Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </NavLink>
                    </ul>
                )}

                {/* Logo without singup */}
                {!user && (
                    <ul className="desktop-list-nav z-10 sm:flex items-center hidden gap-1 ml-[-16px]">
                        <NavLink
                            onClick={() => setAuthScreen("login")}
                            to="/auth"
                        >
                            <li className="cursor-pointer transition-[0.5]">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-[#FFFFFF] dark:bg-[#262626] px-8 py-3 min-h-[48px] text-[#303030] dark:text-white font-semibold hover:bg-[#AFAFAF] dark:hover:bg-[#202020] transition-[0.5]"
                                >
                                    Iniciar sesión
                                </button>
                            </li>
                        </NavLink>

                        <NavLink
                            onClick={() => setAuthScreen("signup")}
                            to="/auth"
                        >
                            <li className="cursor-pointer transition-[0.5]">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-[#864EFF] px-8 py-3 min-h-[48px] text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                                >
                                    Regístrate
                                </button>
                            </li>
                        </NavLink>
                    </ul>
                )}

                {user && (
                    <ul className="mobile-list-nav z-10 flex items-center justify-between bottom-0 left-0 fixed bg-[#EFEFEF] dark:bg-[#151515] w-full h-16 px-2 z-20 sm:hidden">
                        <div
                            onClick={handleFeedClick}
                        >
                            <li className="text-xl py-3 px-6">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M6.49996 7C7.96131 5.53865 9.5935 4.41899 10.6975 3.74088C11.5021 3.24665 12.4978 3.24665 13.3024 3.74088C14.4064 4.41899 16.0386 5.53865 17.5 7C20.6683 10.1684 20.5 12 20.5 15C20.5 16.4098 20.3895 17.5988 20.2725 18.4632C20.1493 19.3726 19.3561 20 18.4384 20H17C15.8954 20 15 19.1046 15 18V16C15 15.2043 14.6839 14.4413 14.1213 13.8787C13.5587 13.3161 12.7956 13 12 13C11.2043 13 10.4413 13.3161 9.87864 13.8787C9.31603 14.4413 8.99996 15.2043 8.99996 16V18C8.99996 19.1046 8.10453 20 6.99996 20H5.56152C4.64378 20 3.85061 19.3726 3.72745 18.4631C3.61039 17.5988 3.49997 16.4098 3.49997 15C3.49997 12 3.33157 10.1684 6.49996 7Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </div>
                        <NavLink
                            to="/BrowserAI"
                        >
                            <li className="text-xl py-3 px-6">
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M10.486 0.0593573C8.24771 0.373871 6.42238 1.13434 4.62051 2.49098C4.13251 2.85713 2.86557 4.12927 2.49487 4.62216C1.12939 6.42945 0.359842 8.30714 0.0689146 10.5181C-0.0108556 11.1519 -0.0249327 12.6493 0.0454528 13.2971C0.125223 14.0247 0.355149 15.1185 0.538152 15.6536C0.552229 15.6912 0.669538 15.6302 0.87131 15.4799C1.04024 15.3532 1.38278 15.1467 1.62678 15.0246C1.99279 14.8368 2.06317 14.7852 2.04909 14.7054C1.74409 13.3018 1.65963 12.5367 1.70655 11.5837C1.8004 9.42437 2.51364 7.47626 3.86035 5.69245C4.22635 5.20894 5.21644 4.21846 5.69976 3.85231C7.50632 2.48628 9.44896 1.77745 11.6121 1.69295C12.6116 1.6554 13.2545 1.72581 14.7091 2.04033C14.7889 2.05441 14.8405 1.984 15.0282 1.61785C15.1502 1.37375 15.3567 1.03576 15.4833 0.862073C15.61 0.69308 15.6945 0.542864 15.6757 0.528782C15.5819 0.477145 14.4839 0.214267 13.963 0.125076C13.2169 -0.00636284 11.2039 -0.0439164 10.486 0.0593573Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M19.0965 0.341013C17.9187 0.603891 16.9333 1.39252 16.4218 2.48628C16.084 3.2092 15.9901 4.25601 16.1872 5.03995C16.4687 6.1384 17.2148 7.05848 18.219 7.54668C18.7727 7.80955 19.0777 7.88466 19.7769 7.90813C20.2836 7.92691 20.4526 7.91752 20.7951 7.83302C21.5694 7.64995 22.1559 7.30727 22.719 6.7111C23.3525 6.03513 23.6903 5.23241 23.7325 4.30765C23.7795 3.1247 23.4275 2.19993 22.6204 1.39252C22.1512 0.923099 21.7336 0.664916 21.1095 0.453675C20.7153 0.317542 20.598 0.303459 20.0349 0.289376C19.6033 0.275294 19.3029 0.29407 19.0965 0.341013Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M23.1319 8.53716C22.963 8.66391 22.6298 8.86576 22.3905 8.9925C22.0292 9.17558 21.9588 9.22722 21.9729 9.30702C22.1418 10.0957 22.2451 10.6683 22.2826 11.0861C22.6955 15.311 20.3353 19.4419 16.4453 21.3055C14.9953 22.0003 13.6111 22.3101 11.9875 22.3054C11.0678 22.3007 10.5376 22.2444 9.6742 22.0472C9.43488 21.9956 9.22842 21.958 9.21904 21.9674C9.21434 21.9721 9.1205 22.1505 9.01726 22.357C8.91403 22.5636 8.71226 22.8969 8.57149 23.094C8.42603 23.2959 8.32279 23.4649 8.34156 23.4789C8.42133 23.5259 9.73989 23.8357 10.2044 23.9155C10.6221 23.9812 10.974 24 12.0345 24C13.1841 24 13.4234 23.9859 13.9583 23.892C15.9901 23.54 17.8295 22.7326 19.4249 21.498C19.9739 21.0708 20.9077 20.1507 21.3629 19.5874C22.4187 18.2777 23.2305 16.6817 23.6434 15.0997C23.9484 13.9215 24 13.4755 24 12.0062C24 10.8139 23.9859 10.6026 23.8874 10.0581C23.7748 9.4056 23.5261 8.38695 23.4698 8.34C23.451 8.32123 23.3008 8.41511 23.1319 8.53716Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                    <path
                                        d="M3.14242 16.1888C2.21802 16.4282 1.41093 17.0103 0.890079 17.813C0.434919 18.5077 0.256609 19.1931 0.289456 20.0991C0.308225 20.5732 0.33638 20.7375 0.463074 21.1083C0.810309 22.1411 1.50478 22.9203 2.49018 23.3851C3.07203 23.662 3.35827 23.7183 4.15128 23.7183C4.82229 23.7137 4.8739 23.709 5.30091 23.5634C5.87338 23.3663 6.30507 23.1081 6.718 22.7185C7.30924 22.1599 7.70809 21.4745 7.86294 20.7422C7.96148 20.2728 7.9474 19.4231 7.83479 18.9725C7.71279 18.489 7.38432 17.8318 7.08401 17.4656C6.58192 16.8601 5.81707 16.3765 5.04752 16.1841C4.54074 16.0573 3.63981 16.0573 3.14242 16.1888Z"
                                        fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </NavLink>
                        <NavLink
                            to={`/${user.username}`}
                        >
                            <li className="text-xl py-3 px-6">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17.5 21.0001H6.5C5.11929 21.0001 4 19.8808 4 18.5001C4 14.4194 10 14.5001 12 14.5001C14 14.5001 20 14.4194 20 18.5001C20 19.8808 18.8807 21.0001 17.5 21.0001Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                        stroke="#6d6d6d"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </li>
                        </NavLink>
                    </ul>
                )}
                {user && (
                    <div className="flex">
                        <NavLink
                            to="/Notifications"
                            className="sm:hidden"
                            onClick={() => setShowDot(false)}
                        >
                            <div className="text-xl p-2 relative">
                                <svg width="24px" height="22px" viewBox="0 0 24 24" fill="none">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <g id="style=doutone">
                                                <g id="notification-bell">
                                                <path id="vector (Stroke)" fillRule="evenodd" clipRule="evenodd" d="M8.87378 18.6934C9.28799 18.6934 9.62378 19.0291 9.62378 19.4434C9.62378 19.6166 9.66765 19.7955 9.76263 19.9722C9.85831 20.15 10.0063 20.3258 10.21 20.4827C10.4138 20.6396 10.6653 20.7712 10.9534 20.8631C11.2413 20.955 11.5544 21.0035 11.8734 21.0035C12.1923 21.0035 12.5054 20.955 12.7933 20.8631C13.0814 20.7712 13.3329 20.6396 13.5367 20.4827C13.7404 20.3258 13.8884 20.15 13.9841 19.9722C14.0791 19.7955 14.1229 19.6166 14.1229 19.4434C14.1229 19.0291 14.4587 18.6934 14.8729 18.6934C15.2871 18.6934 15.6229 19.0291 15.6229 19.4434C15.6229 19.8769 15.5116 20.2987 15.3051 20.6827C15.0993 21.0653 14.8054 21.3989 14.452 21.6711C14.0987 21.9431 13.6889 22.1519 13.2492 22.2922C12.8093 22.4325 12.3422 22.5035 11.8734 22.5035C11.4045 22.5035 10.9374 22.4325 10.4975 22.2922C10.0578 22.1519 9.64798 21.9431 9.29471 21.6711C8.94129 21.3989 8.64739 21.0653 8.44158 20.6827C8.23509 20.2987 8.12378 19.8769 8.12378 19.4434C8.12378 19.0291 8.45957 18.6934 8.87378 18.6934Z" fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
                                                <path id="vector (Stroke)_2" fillRule="evenodd" clipRule="evenodd" d="M8.28966 2.36993C10.5476 1.24631 13.1934 1.20809 15.4828 2.26601L15.6874 2.36056C18.0864 3.46909 19.6223 5.87083 19.6223 8.51353L19.6223 9.82417C19.6223 10.8777 19.8519 11.9185 20.2951 12.8742L20.5598 13.445C21.7754 16.0663 20.1923 19.1303 17.3509 19.6555L17.2146 18.918L17.3509 19.6555L17.1907 19.6851C13.6756 20.3349 10.0711 20.3349 6.55594 19.6851C3.6763 19.1529 2.15285 15.967 3.54631 13.3914L3.77272 12.9729C4.3316 11.9399 4.62426 10.7839 4.62426 9.60942L4.62426 8.28813C4.62426 5.77975 6.04397 3.48746 8.28966 2.36993ZM14.8536 3.62766C12.9772 2.76057 10.8086 2.7919 8.95794 3.71284C7.22182 4.57679 6.12426 6.34893 6.12426 8.28813L6.12426 9.60942C6.12426 11.0332 5.76949 12.4345 5.09201 13.6867L4.86561 14.1052C3.95675 15.785 4.95039 17.863 6.82857 18.2101C10.1635 18.8265 13.5832 18.8265 16.9181 18.2101L17.0783 18.1805C18.9561 17.8334 20.0024 15.8084 19.199 14.076L18.9343 13.5053C18.3994 12.3518 18.1223 11.0956 18.1223 9.82416L18.1223 8.51353C18.1223 6.45566 16.9263 4.58543 15.0582 3.72221L14.8536 3.62766Z" fill="#6d6d6d" stroke="#6d6d6d" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
                                                </g>
                                            </g>
                                        </g>
                                </svg>
                                {showDot && (
                                    <span className="absolute top-[90%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-2 h-2 bg-[#ed4956] rounded-full"></span>
                                )}
                            </div>
                        </NavLink>

                        <NavLink
                            to="/Search"
                            className="sm:hidden"
                        >
                            <div className="text-xl p-2 relative">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="p-[1px]">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 22L21 21" stroke="#6d6d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                            </div>
                        </NavLink>

                        <div
                            className="cursor-pointer my-auto p-2"
                            onClick={() => setOpenDropMenu((prev) => !prev)}
                        >
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M4 17H20M4 12H20M4 7H20"
                                    stroke="#6d6d6d"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Logo without singup */}
                {!user && (
                    <ul className="mobile-list-nav z-10 flex items-center justify-between bottom-0 left-0 fixed bg-[#EFEFEF] dark:bg-[#151515] w-full h-20 px-10 z-20 sm:hidden">
                        <NavLink
                            onClick={() => setAuthScreen("login")}
                            to="/auth"
                        >
                            <li className="cursor-pointer transition-[0.5]">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-[#FFFFFF] dark:bg-[#262626] px-8 py-3 min-h-[48px] text-[#303030] dark:text-white font-semibold hover:bg-[#AFAFAF] dark:hover:bg-[#202020] transition-[0.5]"
                                >
                                    Iniciar sesión
                                </button>
                            </li>
                        </NavLink>

                        <NavLink
                            onClick={() => setAuthScreen("signup")}
                            to="/auth"
                        >
                            <li className="cursor-pointer transition-[0.5]">
                                <button
                                    type="button"
                                    className="w-full rounded-md bg-[#864EFF] px-8 py-3 min-h-[48px] text-white font-semibold hover:bg-[#572bb4] transition-[0.5]"
                                >
                                    Regístrate
                                </button>
                            </li>
                        </NavLink>
                    </ul>
                )}

                {openDropMenu && (
                    <span ref={dropDownMenuRef} className="absolute top-full right-0 sm:right-2">
                        <DropDownMenu />
                    </span>
                )}

            </header>
        </div>
    );
};

export { Navbar as default };
