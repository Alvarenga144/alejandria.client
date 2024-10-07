import React, { useState } from 'react';
import Layout from "../../Components/Layout";
import Navbar from "../../Components/Navbar";
import { debounce } from 'lodash';
import UserProfileLink from '../../Components/UserProfileLink/index';
import { useEffect } from 'react';
import { useRecoilValue } from "recoil";
import userAtom from '../../atoms/userAtom';

const UserExplorer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentUser = useRecoilValue(userAtom);

    const debouncedSearch = debounce(async (term) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/User/Search?term=${term}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios');
            }
            setUsers(data);
        } catch (error) {
            // console.error("Error al buscar usuarios:", error);
            setUsers([]); // Limpia los resultados en caso de error
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        } else {
            setUsers([]);
        }
        
        return () => debouncedSearch.cancel();
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className="px-2 transition-[0.5]">
                    <input className="w-full mb-4 mt-2 rounded p-2 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 bg-white dark:bg-[#262626] dark:text-[#FAFAFA] dark:focus:ring-violet-200/20 dark:placeholder:text-[#565656]" value={searchTerm} onChange={handleSearchChange} placeholder="Buscar usuarios..." />

                    {loading ? <div className="text-[#7439f2] my-4 font-semibold transition-[0.5]">Cargando...</div> : users.map(user => (
                        <UserProfileLink key={user._id} user={user} currentUser={currentUser} />
                    ))}
                </div>
            </Layout>
        </>
    );
}

export { UserExplorer as default };