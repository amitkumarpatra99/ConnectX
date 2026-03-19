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
                'ig-dark': '#121212',
                'ig-elevated': '#262626',
                'ig-stroke': '#363636',
                'ig-primary': '#f5f5f5',
                'ig-secondary': '#a8a8a8',
                'ig-link': '#0095f6',
                'ig-link-hover': '#1877f2',
                'ig-red': '#ed4956',

                // ConnectX Accent Palette
                'cx-blue': '#4f8ef7',
                'cx-purple': '#8b5cf6',
                'cx-pink': '#ec4899',
                'cx-surface': 'rgba(255,255,255,0.04)',
                'cx-border': 'rgba(255,255,255,0.08)',

                // Legacy metal colors
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
                    950: '#000000',
                },
            },
            backgroundImage: {
                'ig-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                'cx-gradient': 'linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 50%, #ec4899 100%)',
                'cx-gradient-subtle': 'linear-gradient(135deg, rgba(79,142,247,0.15) 0%, rgba(139,92,246,0.15) 100%)',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(79, 142, 247, 0.35)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
                'glow-sm': '0 0 10px rgba(79, 142, 247, 0.2)',
                'card': '0 4px 24px rgba(0,0,0,0.4)',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'like-pop': {
                    '0%': { transform: 'scale(1)' },
                    '30%': { transform: 'scale(1.4)' },
                    '60%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(1)', opacity: '0.8' },
                    '100%': { transform: 'scale(1.25)', opacity: '0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                'progress-bar': {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
            },
            animation: {
                shimmer: 'shimmer 2s infinite linear',
                'slide-up': 'slide-up 0.3s ease-out',
                'fade-in': 'fade-in 0.25s ease-out',
                'like-pop': 'like-pop 0.4s ease-out',
                'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
                float: 'float 3s ease-in-out infinite',
                'progress-bar': 'progress-bar 5s linear forwards',
            },
        },
    },
    plugins: [],
}
