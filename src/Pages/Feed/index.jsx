import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import Navbar from "../../Components/Navbar";
import PostsFeed from "../../Components/PostsFeed";
import ProductsFeed from "../../Components/ProductsFeed";

const Feed = () => {
    const [selectedContentType, setSelectedContentType] = useState(localStorage.getItem('selectedContentType') || 'aportes');

    useEffect(() => {
        localStorage.setItem('selectedContentType', selectedContentType);
    }, [selectedContentType]);

    return (
        <>
            <Navbar />
            <Layout>
                <div className="flex items-center justify-center mt-1 border-b border-[#ADADAD] dark:border-[#464646]">
                    <button
                        className="text-base font-semibold w-full py-2 text-[#303030] dark:text-[#9e9e9e] rounded-t-lg hover:bg-[#dddddd] dark:hover:bg-[#262626] transition-[0.5]"
                        onClick={() => setSelectedContentType('aportes')}
                    >
                        Aportes
                    </button>
                    <div className="relative w-full">
                        <button
                            className="text-base font-semibold w-full py-2 text-[#303030] dark:text-[#9e9e9e] rounded-t-lg hover:bg-[#dddddd] dark:hover:bg-[#262626] transition-[0.5]"
                            onClick={() => setSelectedContentType('productos')}
                        >
                            Market
                        </button>
                        <div className="absolute top-[6px] right-[8px] transform translate-x-1/2 translate-y-1/2 bg-[#FC6736] text-white rounded-xl px-1 py-1 text-xs font-bold italic sm:right-[72px]" style={{ transform: 'rotate(-16deg)' }}>
                            New
                        </div>
                    </div>
                </div>

                {selectedContentType === 'aportes' ? (
                    <PostsFeed />
                ) : (
                    <ProductsFeed />
                )}
            </Layout>
        </>
    );
};

export default Feed;
