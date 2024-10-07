import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { NavLink } from "react-router-dom";
import useFollowUnfollow from "../../Hooks/useFollowUnfollow";
import usePreviewImg from "../../Hooks/usePreviewImg.js";
import LoadingDots from '../LoadingDots/index'

const UserHeader = ({ user, setSelectedContentType }) => {
    const currentUser = useRecoilValue(userAtom);
    const { handleFollow, updating, following } = useFollowUnfollow(user);

    const defaultProfilePic = "https://alejandriabetastorage.blob.core.windows.net/avatars-images/UserProfileDefaultAlejandria.jpg";
    const initialProfilePic = defaultProfilePic;
    const { imgUrl } = usePreviewImg(initialProfilePic);

    const verifiedInsignia = "https://alejandriaimages.blob.core.windows.net/user-insignia/favicon.png";

    return (
        <div className="bg-[#EFEFEF] dark:bg-[#151515]">
            <div className="flex items-center justify-center pt-8 flex-col">
                {user.profilePic && (
                    <img
                        name={user.name}
                        src={user.profilePic}
                        className="rounded-full object-cover min-w-32 min-h-32 max-w-32 max-h-32 border border-[#ADADAD]"
                    />
                )}
                {!user.profilePic && (
                    <img
                        name={user.name}
                        src={user.profilePic || imgUrl}
                        className="rounded-full object-cover min-w-32 min-h-32 max-w-32 max-h-32 border border-[#ADADAD]"
                    />
                )}

                <div className="flex mt-5 items-center justify-center">
                    <h1 className="text-[#303030] font-bold text-xl dark:text-[#FAFAFA]">{user.name}</h1>
                    {user.isVerified && (
                        <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" className="ml-[4px] mt-[2px]">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z" fill="#864eff" />
                            </g>
                        </svg>
                    )}
                </div>

                <h1 className="text-[#616161] text-sm mt-[2px] dark:text-[#9e9e9e]">
                    {user.username} • <span className="bg-[#FFFFFF] px-2 rounded-full dark:bg-[#262626]">{user.userType}</span>
                </h1>
                <div className="max-w-96">
                    <h1 className="text-[#303030] text-sm pt-3 text-center dark:text-[#FAFAFA]">
                        {user.bio}
                    </h1>
                </div>
                <h1 className="text-[#616161] text-sm mt-[2px] py-2 dark:text-[#9e9e9e]">
                    {user.followers.length} seguidores • {user.following.length} siguiendo
                </h1>
            </div>

            {currentUser?._id === user._id && (
                <NavLink to="/update">
                    <button className="flex justify-center border-[2px] rounded-xl border-[#ADADAD] hover:bg-[#dddddd] dark:border-[#464646] text-base font-semibold p-2 w-full h-full text-[#303030] cursor-pointer mt-2 dark:text-[#9e9e9e] transition-[0.5] dark:hover:bg-[#262626]">
                        Editar perfil
                    </button>
                </NavLink>
            )}
            {currentUser?._id !== user._id && (
                <button
                    className="flex justify-center border-[2px] rounded-xl border-[#ADADAD] dark:border-[#262626] text-base font-semibold p-2 w-full h-full text-[#303030] cursor-pointer mt-2 dark:text-[#9e9e9e] transition-[0.5] dark:hover:bg-[#262626]"
                    onClick={handleFollow}
                    disabled={updating} // Deshabilita el botón mientras se está actualizando
                >
                    {updating ? (
                        <LoadingDots />
                    ) : (
                        following ? "Siguiendo" : "Seguir"
                    )}
                </button>
            )}

            <div className="flex items-center justify-center mt-6 border-b border-[#ADADAD] dark:border-[#464646]">
                <button
                    className="text-base font-semibold w-full py-1 text-[#303030] dark:text-[#9e9e9e] rounded-t-lg hover:bg-[#dddddd] dark:hover:bg-[#262626] transition-[0.5]"
                    onClick={() => setSelectedContentType('aportes')}
                >
                    Aportes
                </button>
                <button
                    className="text-base font-semibold w-full py-1 text-[#303030] dark:text-[#9e9e9e] rounded-t-lg hover:bg-[#dddddd] dark:hover:bg-[#262626] transition-[0.5]"
                    onClick={() => setSelectedContentType('productos')}
                >
                    Market
                </button>
            </div>
        </div>
    );
};

export { UserHeader as default };
