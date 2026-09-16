import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getRecommendations } from '../api/client';
import { useLanguage } from '../contexts/LanguageContext';

const SKILL_LEVELS = [
    { value: '', label: 'เลือกช่วงชั้น / ระดับชั้นเรียน' },
    { value: 'beginner', label: 'มือใหม่ / พื้นฐาน' },
    { value: 'intermediate', label: 'กลาง (ม.ต้น / ม.ปลาย)' },
    { value: 'advanced', label: 'สูง / เตรียมสอบ' },
];

const AVAILABLE_DAYS = [
    { value: 'Mon', label: 'จันทร์' },
    { value: 'Tue', label: 'อังคาร' },
    { value: 'Wed', label: 'พุธ' },
    { value: 'Thu', label: 'พฤหัส' },
    { value: 'Fri', label: 'ศุกร์' },
    { value: 'Sat', label: 'เสาร์' },
    { value: 'Sun', label: 'อาทิตย์' },
];

export default function RequirementForm() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const SKILL_LEVELS_UI = [
        { value: '', label: t('level_default') },
        { value: 'beginner', label: t('level_beginner') },
        { value: 'intermediate', label: t('level_intermediate') },
        { value: 'advanced', label: t('level_advanced') },
    ];
    const DAYS_UI = [
        { value: 'Mon', labelKey: 'day_Mon' }, { value: 'Tue', labelKey: 'day_Tue' },
        { value: 'Wed', labelKey: 'day_Wed' }, { value: 'Thu', labelKey: 'day_Thu' },
        { value: 'Fri', labelKey: 'day_Fri' }, { value: 'Sat', labelKey: 'day_Sat' },
        { value: 'Sun', labelKey: 'day_Sun' },
    ];

    // ── Controlled State ──
    // React เก็บค่าทุก field ไว้ใน state เสมอ ไม่อ่านจาก DOM
    const [subject, setSubject]         = useState('');
    const [skillLevel, setSkillLevel]   = useState('');
    const [budget, setBudget]           = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    // ── Loading / Error State ──
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    // Toggle วันที่เลือก (checkbox แบบ custom)
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate
        if (!subject.trim()) return setError(t('err_subject'));
        if (!skillLevel)      return setError(t('err_level'));
        if (!budget || Number(budget) <= 0) return setError(t('err_budget'));
        if (selectedDays.length === 0) return setError(t('err_days'));

        setLoading(true);
        try {
            const requirement = {
                subject:         subject.trim(),
                skill_level:     skillLevel,
                budget_per_hour: Number(budget),
                available_days:  selectedDays,
            };

            // เรียก Node.js Backend (POST /api/recommend)
            const results = await getRecommendations(requirement);

            // ส่ง results + requirement ไปหน้า TutorResults ผ่าน router state
            navigate('/results', { state: { results, requirement } });

        } catch (err) {
            setError(err.response?.data?.error || t('err_generic'));
        } finally {
            setLoading(false);
        }
    };

    // ── Shared input class ──
    const inputCls = 'w-full border border-border-soft rounded-lg px-4 py-3 text-sm text-text-main bg-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-muted';

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />

            <main className="py-12 px-4">
                {/* Card — กลางจอบน desktop, เต็มความกว้างบน mobile */}
                {/* max-w-full = mobile เต็มจอ | md:max-w-lg = tablet ขึ้นไปจำกัดความกว้าง */}
                <div className="card max-w-full md:max-w-lg mx-auto p-8 md:p-10">

                    {/* Header */}
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-text-main mb-2">
                        {t('form_heading')}
                    </h1>
                    <p className="text-sm text-text-sub mb-8 leading-relaxed">
                        {t('form_sub')}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Field 1: วิชา */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                {t('label_subject')}
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder={t('placeholder_subject')}
                                className={inputCls}
                            />
                        </div>

                        {/* Field 2: ระดับผู้เรียน */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                {t('label_level')}
                            </label>
                            <select
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                                className={`${inputCls} cursor-pointer`}
                            >
                                {SKILL_LEVELS_UI.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Field 3: งบประมาณ */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                {t('label_budget')}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder={t('placeholder_budget')}
                                    min="0"
                                    className={`${inputCls} pr-16`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                                    {t('unit_budget')}
                                </span>
                            </div>
                        </div>

                        {/* Field 4: วันที่ว่าง (toggle buttons) */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">
                                {t('label_days')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS_UI.map((day) => {
                                    const isSelected = selectedDays.includes(day.value);
                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-150 ${
                                                isSelected
                                                    ? 'bg-brand-red text-white border-brand-red'
                                                    : 'bg-white text-text-sub border-border-soft hover:border-brand-red'
                                            }`}
                                        >
                                            {t(day.labelKey)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <p className="text-brand-red text-sm bg-brand-red-light px-4 py-2.5 rounded-lg">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                    {t('btn_analyzing')}
                                </span>
                            ) : t('btn_submit')}
                        </button>
                    </form>
                </div>

                {/* Security note */}
                <p className="text-center text-xs text-text-muted mt-4 flex items-center justify-center gap-1">
                    {t('privacy_note')}
                </p>
            </main>
        </div>
    );
}
