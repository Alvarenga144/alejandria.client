import React from "react";

const Layout = ({ children }) => {
    return (
        <div className="items-center max-w-[620px] mx-auto px-2 pb-[64px] sm:pb-0">
            <main className="flex-grow rounded-xl">
                <div className="flex flex-col w-full flex-grow bg-cover max-h-full overflow-hidden">

                    {children}
                    
                </div>
            </main>
        </div>
    );
}

export { Layout as default };