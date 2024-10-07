/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            animation: {
                bounce200: 'bounce 1s infinite 400ms',
                bounce400: 'bounce 1s infinite 800ms',
            },

        },
    },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
}