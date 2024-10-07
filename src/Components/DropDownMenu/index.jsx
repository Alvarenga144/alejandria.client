import React, { useContext } from 'react';
import LogoutButton from "../LogoutButton";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { ThemeContext } from '../../Context/ThemeContext.jsx';

const DropDownMenu = () => {
    const user = useRecoilValue(userAtom);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="flex flex-col absolute top-0 right-4 w-40 rounded-lg border border-[#dddddd] dark:border-[#464646] bg-[#f7f7f7] dark:bg-[#202020] sm:top-[-20px] sm:right-6">
            <ul className="flex flex-col">
                <li className="cursor-pointer rounded-t-lg py-2 px-4 border-b border-[#dddddd] dark:border-[#464646] dark:text-[#FAFAFA] dark:hover:bg-[#262626]">
                    <button className='w-full h-full' onClick={toggleTheme}>
                        {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                    </button>
                </li>
                <li className="cursor-pointer rounded-b-lg py-2 px-4 dark:hover:bg-[#262626]">
                    {user && <LogoutButton />}
                </li>
            </ul>
        </div>
    );
};

export default DropDownMenu;