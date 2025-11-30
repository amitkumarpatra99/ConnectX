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
                metal: {
                    50: '#f0f9ff', // Sky 50
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9', // Sky 500
                    600: '#0284c7',
                    700: '#0369a1', // Deep Blue
                    800: '#075985',
                    900: '#0c4a6e', // Dark Blue
                    950: '#082f49', // Midnight Blue
                },
                primary: '#3b82f6', // Blue
            },
            backgroundImage: {
                'metal-gradient': 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #e0f2fe 100%)',
                'metal-dark': 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0c4a6e 100%)', // Ocean Blue Gradient
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                'glass-dark': 'linear-gradient(135deg, rgba(12, 74, 110, 0.6) 0%, rgba(8, 47, 73, 0.6) 100%)', // Blue Glass
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.2)',
                'metal': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [],
}
