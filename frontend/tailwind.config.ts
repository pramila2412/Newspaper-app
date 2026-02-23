export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // ─── Primary Brand (Teal - per user rules) ─── 
                primary: {
                    DEFAULT: '#0D9488',
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#14B8A6',
                    600: '#0D9488',
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                },
                // ─── Accent (Warm amber for highlights) ───
                accent: {
                    DEFAULT: '#F59E0B',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                    800: '#92400E',
                    900: '#78350F',
                },
                // ─── Teal (Action color - per user rules) ───
                teal: {
                    DEFAULT: '#1CA7A6',
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#1CA7A6',
                    600: '#0D9488',
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                },
                // ─── Light Mode Neutrals ───
                cream: {
                    DEFAULT: '#F8FAFC',
                    50: '#FFFFFF',
                    100: '#F8FAFC',
                    200: '#F1F5F9',
                    300: '#E2E8F0',
                    400: '#CBD5E1',
                },
                // ─── Dark Mode Surfaces (Slate-based, like Linear/Vercel) ───
                surface: {
                    DEFAULT: '#FFFFFF',
                    dark: '#0F172A',      // slate-900 — main bg
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    dark: '#1E293B',      // slate-800 — card/elevated bg
                },
                // ─── Deep Blue (Header - per user rules) ───
                navy: {
                    DEFAULT: '#0B3C5D',
                    light: '#0e4a72',
                    dark: '#082d47',
                },
                dark: '#1E293B',
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
            },
            borderColor: {
                DEFAULT: '#E2E8F0',
            },
        },
    },
    plugins: [],
};
