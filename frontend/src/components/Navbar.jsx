import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar({ backLabel, backTo }) {
    const location = useLocation();
    const { lang, switchLang, t } = useLanguage();
    const isLanding = location.pathname === '/';

    return (
        <nav className="bg-brand-red border-b border-brand-red-dark sticky top-0 z-50">
            <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo — white on dark red */}
                <Link to="/" className="flex items-center">
                    <span className="font-bold text-xl text-white tracking-wide">Tutee</span>
                </Link>

                {/* Nav Right */}
                {isLanding ? (
                    <div className="flex items-center gap-6">
                        <Link to="/find" className="hidden md:block text-sm text-white/70 hover:text-white transition-colors">{t('nav_find')}</Link>
                        <Link to="/chat" className="hidden md:block text-sm text-white/70 hover:text-white transition-colors">{t('nav_how')}</Link>
                        <a href="#" className="hidden md:block text-sm text-white/70 hover:text-white transition-colors">{t('nav_for_tutor')}</a>

                        {/* Language Toggle — inverted for dark bg */}
                        <div className="flex items-center border border-white/30 rounded-full overflow-hidden text-xs font-medium">
                            <button
                                onClick={() => switchLang('th')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'th' ? 'bg-white text-brand-red font-semibold' : 'text-white/70 hover:text-white'}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-white text-brand-red font-semibold' : 'text-white/70 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Login button — white outline on dark bg */}
                        <Link
                            to="/find"
                            className="text-sm font-semibold px-5 py-2 rounded-lg border border-white/60 text-white hover:bg-white hover:text-brand-red transition-colors duration-200"
                        >
                            {t('nav_login')}
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        {/* Language Toggle */}
                        <div className="flex items-center border border-white/30 rounded-full overflow-hidden text-xs font-medium">
                            <button
                                onClick={() => switchLang('th')}
                                className={`px-2.5 py-1 transition-colors ${lang === 'th' ? 'bg-white text-brand-red font-semibold' : 'text-white/70 hover:text-white'}`}
                            >
                                TH
                            </button>
                            <button
                                onClick={() => switchLang('en')}
                                className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-white text-brand-red font-semibold' : 'text-white/70 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>
                        <Link
                            to={backTo || '/'}
                            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white border border-white/30 px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                            {backLabel || t('nav_back')}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
