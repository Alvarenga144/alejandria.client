import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';
import useLogout from '../../Hooks/useLogout';

const LogoutButton = () => {
    const setUser = useSetRecoilState(userAtom);

    const logOut = useLogout();

    return (
        <button onClick={logOut} className="text-red-500 w-full" >Salir</button>
    );
}

export { LogoutButton as default };