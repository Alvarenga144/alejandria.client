import React from "react";

const OwnLayout = ({ children }) => {
    return (
        <div className="items-center top-0 bottom-0 max-w-[620px] min-h-screen mx-auto">
            <main id="main" className="flex-grow rounded-xl">
                <div className="flex flex-col w-full flex-grow bg-cover max-h-full overflow-hidden">

                    {children}

                </div>
            </main>
        </div>
    );
}

export { OwnLayout as default };