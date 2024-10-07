import React, { useState } from "react";
import { Link } from "react-router-dom";
import Actions from "../Actions";

const UserPost = ({ likes, replies, postTitle }) => {
    // Estado para el boton de like
    const [liked, setLiked] = useState(false);

    return (
        <Link to={"/alvarenga144/post/1"}>
            <div className="flex py-2 border-b border-[#ADADAD]">
                <img
                    className="w-10 h-10 rounded-full object-cover mt-[4px] cursor-pointer"
                    src="https://pbs.twimg.com/profile_images/1682249314611998720/S5x-Wr3x_400x400.jpg"
                    alt="user avatar"
                />

                <div className="w-full px-2 pb-2">
                    {/* post header */}
                    <div className="flex justify-between gap-2">
                        <p className="font-semibold cursor-pointer hover:underline transition-[0.5]">
                            alvarenga144
                        </p>
                        <div className="flex justify-between gap-2">
                            <p className="text-md text-[#999999]">3h</p>
                            {/* <MoreHorizontal /> */}
                        </div>
                    </div>
                    {/* post body */}
                    <div className="pb-1">
                        <span className="w-full text-md text-[#303030]">{postTitle}</span>
                    </div>
                    {/* icons for reactions, coments, share */}
                    <Actions liked={liked} setLiked={setLiked} />

                    {/* replies and likes */}
                    <div className="flex gap-2">
                        <p className="text-md text-[#999999] cursor-pointer">
                            {replies} respuestas
                        </p>
                        <p className="text-md text-[#999999]">•</p>
                        <p className="text-md text-[#999999] cursor-pointer">
                            {likes} likes
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export { UserPost as default };
