/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Instagram Dark Mode Palette
                'ig-black': '#000000',
                'ig-dark': '#121212',       // Elevated surfaces / cards
                'ig-elevated': '#262626',   // Hover states / search bars
                'ig-stroke': '#363636',     // Borders / Separators
                'ig-primary': '#f5f5f5',    // Main text
                'ig-secondary': '#a8a8a8',  // Secondary text / subtitles
                'ig-link': '#0095f6',       // Blue links / buttons
                'ig-link-hover': '#1877f2',
                'ig-red': '#ed4956',        // Notifications / Likes

                // Retaining some metal colors for legacy support if needed, but overriding primarily
                metal: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#000000', // Override to black
                },
            },
            backgroundImage: {
                'ig-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            },
        },
    },
    plugins: [],
}
