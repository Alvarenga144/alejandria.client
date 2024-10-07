import React from "react";
import { useRecoilValue } from "recoil";
import LoginCard from "../../Components/LoginCard";
import SignupCard from "../../Components/SignupCard";
// import ForgotPassword from "../../Components/ForgotPassword";
// import RestorePassword from "../../Components/RestorePassword";
import authScreenAtom from "../../atoms/authAtom";

const Auth = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <>
            {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
        </>
    );
}

export { Auth as default }