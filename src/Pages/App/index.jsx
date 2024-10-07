import { React, useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import * as jwtDecode from 'jwt-decode';
import { useSetRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom.js";
import Feed from "../Feed";
import AuthPage from "../Auth";
import ConfirmAccount from '../ServicesPage'
import UserExplorer from "../UsersExplorer/UserExplorer.jsx";
import BrowserAI from "../BrowserAI/index.jsx";
import VoiceChatAI from "../VoiceChat/index.jsx";
import UpdateProfile from "../UpdateProfile";
import Notifications from "../Notifications/index.jsx"
import Account from "../Account"; 
import CreateMenu from "../../Components/CreateMenu";
import PostPage from "../PostPage";
import ProductPage from "../ProductPage";
import ForgotPassword from '../../Components/ForgotPassword'
import RestorePassword from '../../Components/RestorePassword'
import { Toaster } from "sonner";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from '../../Context/ThemeContext.jsx';

const AppRoutes = () => {
    const setUser = useSetRecoilState(userAtom);
    const user = useRecoilValue(userAtom);
    const tokenIsSet = document.cookie.indexOf('token=') > 1;

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('session-alejandria'))?.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                // Token has expired, clear session data
                localStorage.removeItem('session-alejandria');
                setUser(null);
            }
        } else {
            if(!tokenIsSet){
                setUser(null);
            }
        }
    }, [setUser]);

    let routes = useRoutes([
        {
            path: "/",
            element: user && tokenIsSet ? (
                <>
                    <Feed />
                    <CreateMenu />
                </>
            ) : (
                <Navigate to="/auth" />
            ),
        },
        { path: "/auth", element: !user ? <AuthPage /> : <Navigate to="/" /> },
        { path: "/restoreKeys", element: !user ? <ForgotPassword /> : <Navigate to="/" /> },
        { path: "/verify/:token", element: <ConfirmAccount /> },
        { path: "/updateNewKeys/:token", element: <RestorePassword /> },
        { path: "/Search", element: !user ? <AuthPage /> : <UserExplorer /> },
        { path: "/Notifications", element: !user ? <AuthPage /> : <Notifications /> },
        { path: "/BrowserAI", element: !user ? <AuthPage /> : <BrowserAI /> },
        { path: "/VoiceChatAI", element: <VoiceChatAI /> },
        { path: "/update", element: !user ? <AuthPage /> : <UpdateProfile /> },
        {
            path: "/:username",
            element: user ? (
                <>
                    <Account />
                    <CreateMenu />
                </>
            ) : (
                <Account />
            ),
        },
        { path: "/:username/post/:pid", element: <PostPage /> },
        { path: "/:username/Product/:pid", element: <ProductPage /> },
    ]);
    return routes;
};

const App = () => {
    return (
        <ChakraProvider>
            <ThemeProvider>
                <Toaster position="top-right" closeButton richColors expand={false} />
                <AppRoutes />
            </ThemeProvider>
        </ChakraProvider>
    );
};

export default App;

{/* 

paleta de colores para darkmode
https://colorhunt.co/palette/1b00445727a39153f4d6c5f0

gris como threads: #151515

morado oscuro: #1B0044
menos oscuro: #5727A3
similar al princiopal: 9153F4
casi rosa palido: D6C5F0

*/}