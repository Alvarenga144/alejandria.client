﻿import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionsProduct from "../ActionsProduct/index";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal } from "react-feather";
import { useRecoilValue, useRecoilState } from "recoil";
import usePreviewImg from "../../Hooks/usePreviewImg.js";
import userAtom from "../../atoms/userAtom";
import productsAtom from "../../atoms/productsAtom";
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from "react-feather"

const Product = ({ produ, postedBy }) => {
    const currentUser = useRecoilValue(userAtom);
    const [products, setProducts] = useRecoilState(productsAtom);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const defaultProfilePic = "https://alejandriabetastorage.blob.core.windows.net/avatars-images/UserProfileDefaultAlejandria.jpg";
    const initialProfilePic = user?.profilePic || defaultProfilePic;
    const { imgUrl } = usePreviewImg(initialProfilePic); // imagen de perfil

    const slide = (direction) => {
        var slider = document.getElementById(`slider-${produ.id}`);
        var imageWidth = slider.firstChild.offsetWidth; // Ancho de la primera imagen
        var margin = 8; // Margen total (4px a cada lado)
        var scrollAmount = imageWidth + margin; // Cantidad a desplazar

        if (direction === 'left') {
            slider.scrollLeft -= scrollAmount;
        } else {
            slider.scrollLeft += scrollAmount;
        }
    };

    const convertLineToJSX = (line) => {
        const urlRegex = /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?\b/;
        const mentionRegex = /(^|[^@\w])@(\w{1,15})\b(?!@[\w.]+)/g;
        const parts = line.split(/(\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?\b)/g);
    
        let allParts = [];
        parts.map((part) => {
            allParts = [...allParts, ...part.split(/(@\w+)/).filter(str => str.trim())];
        });
        
        return allParts.map((part, index) => {
            if (urlRegex.test(part)) {
                const protocol = /^https?:\/\//.test(part) ? '' : 'http://';
                return <Link key={index} to={`${protocol}${part}`} target="_blank" rel="noopener noreferrer" className="text-[#7439f2] dark:text-[#a589f7] hover:underline cursor-pointer">{part}</Link>;
            } else if (mentionRegex.test(part)) {
                let username = part.replace('@', '');
                return <Link key={index} to={`/${username}`} className="text-[#7439f2] dark:text-[#a589f7] hover:underline cursor-pointer">{part}</Link>
            } else {
                return part;
            }
        });
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/User/Profile/" + postedBy);
                if (!res.ok) {
                    toast.error('¡Ups! Ah ocurrido un error', {
                        className: 'error-toast',
                        description: "Intentalo de nuevo",
                        duration: 5000
                    });
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch (error) {
                setUser(null);
            }
        };

        getUser();
    }, [postedBy]);

    const handleDeleteProduct = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("¿Estás seguro de eliminar tu aporte? No podrás recuperarlo")) return;

            const res = await fetch(`/api/Product/DeleteProduct/${produ.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                toast.error('¡Ups! Ah ocurrido un error', {
                    className: 'error-toast',
                    description: "Intentalo más tarde",
                    duration: 6000
                });
                return;
            }
            const data = await res.json();
            setProducts((prev) => prev.filter((p) => p.id !== produ.id));

            toast.success('Se ha eliminado tu aporte correctamente', {
                className: 'success-toast',
                duration: 5000
            });
        } catch (error) {
            toast.error('¡Ups! Ah ocurrido un error', {
                className: 'error-toast',
                description: "Intentalo más tarde",
                duration: 6000
            });
        }
    }; 

    if (!user) return null;
    
    return (
        <Link to={`/${user.username}/Product/${produ.id}`}>
            <div className="py-2 border-b border-[#ADADAD] dark:border-[#464646]">
                {/* post header */}
                <div className="flex justify-between gap-2">
                    <div className="flex">
                        <img
                            className="mr-2 min-w-10 min-h-10 max-w-10 max-h-10 rounded-full object-cover mt-[6px] cursor-pointer"
                            src={user.profilePic || imgUrl}
                            alt={user.name}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        />
                        <p
                            className="font-semibold cursor-pointer hover:underline transition-[0.5] text-[#303030] dark:text-[#FAFAFA]"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        >
                            <span className="flex">
                                {user.username}
                                {user.isVerified && (
                                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" className="ml-[4px] mt-[4px]">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z" fill="#864eff" />
                                        </g>
                                    </svg>
                                )}
                            </span>
                            <span className="bg-[#864eff] text-sm font-semibold px-2 text-[#FFFFFF] rounded-full">{produ.category}</span>
                        </p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className="text-md text-[#646464]">
                            {formatDistanceToNow(new Date(produ.createdAt), { locale: es })}
                        </p>
                        {currentUser?._id === user._id && (
                            <MoreHorizontal className="text-[#303030] dark:text-[#646464]" onClick={handleDeleteProduct} />
                        )}
                    </div>
                </div>

                {/* product body */}
                <div className="my-2 ml-10">
                    <p className="text-lg font-bold text-[#303030] dark:text-[#FAFAFA]">{produ.title}</p>
                    <p className="text-md font-semibold text-[#303030] dark:text-[#FAFAFA] mb-1">${produ.price}</p>

                    {produ.detailedDescription.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            <span className="w-full text-md text-[#303030] dark:text-[#FAFAFA] mb-1">{convertLineToJSX(line)}</span>
                            <br />
                        </React.Fragment>
                    ))}
                </div>
                <div className='relative flex items-center w-full mb-2 overflow-hidden'>
                    <div className='py-20 cursor-pointer dark:text-[#FAFAFA]'
                        onClick={(e) => {
                        e.preventDefault();
                        slide('left')
                        }}
                    >
                        <ChevronLeft className='opacity-50 hover:opacity-100 dark:hover:opacity-20'
                            size={40}
                        />
                    </div>
                    <div
                        id={`slider-${produ.id}`}
                        className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'
                    >
                        {produ.imgs.map((img, index) => (
                            <img src={img} alt={`Slide ${index + 1}`} key={index}
                                className='inline-block mr-1 object-contain cursor-pointer rounded-xl'
                                style={{ maxWidth: 'auto', maxHeight: '60vh' }}
                            />
                        ))}
                    </div>
                    <div className='py-20 cursor-pointer dark:text-[#FAFAFA]'
                        onClick={(e) => {
                        e.preventDefault();
                        slide('right')
                        }}
                    >
                        <ChevronRight className='opacity-50 hover:opacity-100 dark:hover:opacity-20'
                            size={40}
                        />
                    </div>
                </div>
                <div className="ml-10">
                    {/* icons for reactions, coments, share */}
                    <ActionsProduct produ={produ} />
                </div>
            </div>
        </Link>
    );
};

export { Product as default };