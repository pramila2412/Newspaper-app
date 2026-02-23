import React, { useState, useCallback } from 'react';

/**
 * Language switcher: EN ↔ മലയാളം
 * Uses Google Translate cookie approach which is the most reliable method.
 * On switch: sets the googtrans cookie and reloads ONCE.
 * On load: detects current language from cookie state.
 */
const LanguageSwitcher: React.FC = () => {
    const [currentLang] = useState<'en' | 'ml'>(() => {
        // Detect current language from Google Translate cookie
        const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
        if (match && match[1] === 'ml') return 'ml';
        return 'en';
    });

    const switchTo = useCallback((lang: 'en' | 'ml') => {
        if (lang === currentLang) return;

        // Set cookie for Google Translate
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${location.hostname}`;

        if (lang === 'ml') {
            document.cookie = `googtrans=/en/ml; path=/;`;
            document.cookie = `googtrans=/en/ml; path=/; domain=.${location.hostname}`;
        }

        // Reload to apply - this only happens ONCE per switch
        location.reload();
    }, [currentLang]);

    return (
        <div className="flex items-center rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 text-[11px] font-semibold select-none">
            <button
                onClick={() => switchTo('en')}
                className={`px-2.5 py-1 transition-colors ${currentLang === 'en'
                        ? 'bg-[#1CA7A6] text-white'
                        : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => switchTo('ml')}
                className={`px-2.5 py-1 transition-colors ${currentLang === 'ml'
                        ? 'bg-[#1CA7A6] text-white'
                        : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
            >
                മലയാളം
            </button>
        </div>
    );
};

export default LanguageSwitcher;
