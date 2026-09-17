import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { IconTarget, IconChart, IconChat, IconStar, IconBox } from '../components/Icons';

// SVG Icons ถูกนำเข้าจาก Icons.jsx แล้ว

const FEATURE_ICONS = [IconTarget, IconChart, IconChat];
const FEATURE_KEYS  = [
    { title: 'feat1_title', desc: 'feat1_desc' },
    { title: 'feat2_title', desc: 'feat2_desc' },
    { title: 'feat3_title', desc: 'feat3_desc' },
];

const HIW_NUMS = ['01', '02', '03'];
const HIW_KEYS = [
    { title: 'hiw_step1_title', desc: 'hiw_step1_desc' },
    { title: 'hiw_step2_title', desc: 'hiw_step2_desc' },
    { title: 'hiw_step3_title', desc: 'hiw_step3_desc' },
];

const TOP_TUTORS = [
    { id: 't001', name: 'พี่รินดา', subject: 'Physics & Calculus', rating: 4.9, price: 350 },
    { id: 't002', name: 'ครูทอมมี่', subject: 'English for Academic', rating: 5.0, price: 400 },
    { id: 't003', name: 'ครูพิชญ์', subject: 'Chemistry & Bio', rating: 4.8, price: 350 },
];

export default function Landing() {
    const { t } = useLanguage();

    const footerCols = [
        { titleKey: 'footer_for_students', links: [{ key: 'footer_find_tutor' }, { key: 'footer_self_assess' }] },
        { titleKey: 'footer_for_tutors',   links: [{ key: 'footer_become_tutor' }] },
        { titleKey: 'footer_about',        links: [{ key: 'footer_contact' }] },
    ];

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />

            {/* ── Hero ── */}
            <section className="py-20 md:py-28 text-center">
                <div className="max-w-content mx-auto px-6">
                    <p className="section-eyebrow">{t('hero_eyebrow')}</p>
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-text-main leading-tight mt-2 mb-6">
                        {t('hero_title').split('\n').map((line, i) => (
                            <span key={i}>{line}{i === 0 && <br />}</span>
                        ))}
                    </h1>
                    <p className="text-text-sub text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        {t('hero_sub')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/find" className="btn-primary w-full sm:w-auto">{t('hero_cta1')}</Link>
                        <a href="#top-matches" className="btn-outline w-full sm:w-auto">{t('hero_cta2')}</a>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-16 bg-cream-dark">
                <div className="max-w-content mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FEATURE_KEYS.map((f, i) => {
                            const Icon = FEATURE_ICONS[i];
                            return (
                                <div key={f.title} className="card p-6">
                                    <IconBox size={40}>
                                        <Icon size={22} />
                                    </IconBox>
                                    <h3 className="font-serif text-lg font-semibold text-text-main mb-2">{t(f.title)}</h3>
                                    <p className="text-sm text-text-sub leading-relaxed">{t(f.desc)}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-20">
                <div className="max-w-content mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-2/5">
                            <p className="section-eyebrow">{t('hiw_eyebrow')}</p>
                            <h2 className="font-serif text-4xl font-bold text-text-main leading-snug mt-2 mb-4">
                                {t('hiw_heading').split('\n').map((line, i) => (
                                    <span key={i}>{line}{i < 2 && <br />}</span>
                                ))}
                            </h2>
                            <p className="text-text-sub text-sm leading-relaxed">{t('hiw_sub')}</p>
                        </div>
                        <div className="lg:w-3/5 flex flex-col gap-8">
                            {HIW_KEYS.map((step, i) => (
                                <div key={step.title} className="flex gap-5 items-start">
                                    <span className="text-3xl font-serif font-bold text-brand-red shrink-0 w-12">
                                        {HIW_NUMS[i]}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-text-main mb-1">{t(step.title)}</h4>
                                        <p className="text-sm text-text-sub">{t(step.desc)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Top Matches ── */}
            <section className="py-16 bg-cream-dark" id="top-matches">
                <div className="max-w-content mx-auto px-6">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="section-eyebrow">{t('top_eyebrow')}</p>
                            <h2 className="font-serif text-3xl font-bold text-text-main mt-1">{t('top_heading')}</h2>
                        </div>
                        <Link to="/find" className="text-sm text-text-sub hover:text-brand-red transition-colors">
                            {t('top_view_all')}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TOP_TUTORS.map((tutor) => (
                            <div key={tutor.id} className="card p-5 flex flex-col gap-4">
                                <div className="w-14 h-14 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red font-bold text-xl font-serif">
                                    {tutor.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-text-main">{tutor.name}</h3>
                                    <p className="text-sm text-text-sub mt-0.5">{tutor.subject}</p>
                                    <div className="flex gap-3 mt-2 text-sm text-text-sub items-center">
                                        <span className="flex items-center gap-1"><IconStar size={13} filled /> {tutor.rating}</span>
                                        <span>{tutor.price} {t('top_price_unit')}</span>
                                    </div>
                                </div>
                                <Link to={`/tutor/${tutor.id}`} className="btn-outline text-sm text-center py-2">
                                    {t('top_view_profile')}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-24 bg-cream text-center">
                <div className="max-w-content mx-auto px-6">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-main leading-snug mb-4">
                        {t('cta_heading').split('\n').map((line, i) => (
                            <span key={i}>{line}{i < 2 && <br />}</span>
                        ))}
                    </h2>
                    <p className="text-text-sub mb-8">{t('cta_sub')}</p>
                    <Link to="/find" className="btn-primary text-base px-8 py-4">{t('cta_btn')}</Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-cream-dark border-t border-border-soft py-12">
                <div className="max-w-content mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        <div className="col-span-2 md:col-span-1">
                            <span className="font-serif text-xl font-bold text-brand-red block mb-3">Tutee</span>
                            <p className="text-xs text-text-sub leading-relaxed">{t('footer_desc')}</p>
                        </div>
                        {footerCols.map((col) => (
                            <div key={col.titleKey}>
                                <h5 className="font-semibold text-sm text-text-main mb-3">{t(col.titleKey)}</h5>
                                {col.links.map((l) => (
                                    <a key={l.key} href="#" className="block text-sm text-text-sub hover:text-brand-red mb-1.5 transition-colors">
                                        {t(l.key)}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border-soft pt-6 text-xs text-text-muted">
                        {t('footer_copy')}
                    </div>
                </div>
            </footer>
        </div>
    );
}
