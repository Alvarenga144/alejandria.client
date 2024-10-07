import React, { useState, useRef } from 'react';
import CreatePost from '../CreatePost/index';
import CreateProduct from '../CreateProduct/index';

const CreateMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef();

    return (
        <div className="fixed bottom-16 right-5 z-30" ref={menuRef}>
            <button
                className="bg-[#f7d72b] text-white p-2 rounded-md shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19" stroke="#5439f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5L12 19" stroke="#5439f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="mt-2 flex flex-col items-end">
                    <CreatePost />
                    <CreateProduct />
                </div>
            )}
        </div>
    );
}

export default CreateMenu;
