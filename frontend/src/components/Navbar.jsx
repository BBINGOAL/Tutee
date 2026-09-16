import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar({ backLabel, backTo }) {
    const location = useLocation();
    const { lang, switchLang, t } = useLanguage();
    const isLanding = location.pathname === '/';

    return (
        <nav className="bg-cream border-b border-border-soft sticky top-0 z-50">
            <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <span className="font-serif text-xl font-bold text-brand-red">Tutee</span>
                </Link>

                {/* Desktop: nav links | Other pages: back button */}
                {isLanding ? (
                    <div className="flex items-center gap-6">
                        <Link to="/find" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">{t('nav_find')}</Link>
                        <Link to="/chat" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">{t('nav_how')}</Link>
                        <a href="#" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">{t('nav_for_tutor')}</a>

                        {/* Language Toggle */}
                        <div className="flex items-center border border-border-soft rounded-full overflow-hidden text-xs font-medium">
                            <button
                                onClick={() => switchLang('th')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'th' ? 'bg-brand-red text-white' : 'text-text-sub hover:text-text-main'}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-brand-red text-white' : 'text-text-sub hover:text-text-main'}`}
                            >
                                EN
                            </button>
                        </div>

                        <Link to="/find" className="btn-primary text-sm px-5 py-2">{t('nav_login')}</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        {/* Language Toggle (หน้าอื่น) */}
                        <div className="flex items-center border border-border-soft rounded-full overflow-hidden text-xs font-medium">
                            <button
                                onClick={() => switchLang('th')}
                                className={`px-2.5 py-1 transition-colors ${lang === 'th' ? 'bg-brand-red text-white' : 'text-text-sub hover:text-text-main'}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-brand-red text-white' : 'text-text-sub hover:text-text-main'}`}
                            >
                                EN
                            </button>
                        </div>
                        <Link to={backTo || '/'} className="btn-outline text-sm px-4 py-2">
                            ← {backLabel || t('nav_back')}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
