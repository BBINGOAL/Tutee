import { createContext, useContext, useState } from 'react';
import th from '../translations/th';
import en from '../translations/en';

const translations = { th, en };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // อ่านภาษาจาก localStorage (ถ้ามี) หรือใช้ 'th' เป็นค่าเริ่มต้น
    const [lang, setLang] = useState(
        () => localStorage.getItem('tutee_lang') || 'th'
    );

    const switchLang = (newLang) => {
        setLang(newLang);
        localStorage.setItem('tutee_lang', newLang);
    };

    // t('key') → คืนข้อความตามภาษาที่เลือก ถ้าไม่เจอ key ให้คืน key นั้นเลย
    const t = (key) => translations[lang]?.[key] ?? key;

    return (
        <LanguageContext.Provider value={{ lang, switchLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Custom hook สำหรับใช้ใน Component ทุกหน้า
export const useLanguage = () => useContext(LanguageContext);
