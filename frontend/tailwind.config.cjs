const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Geist', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Custom colors can be added here
            }
        },
    },
    plugins: [
        require(path.resolve(__dirname, 'node_modules/@tailwindcss/typography')),
    ],
}
