import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getRecommendations } from '../api/client';

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
        if (!subject.trim()) return setError('กรุณาระบุวิชาที่ต้องการเรียน');
        if (!skillLevel)      return setError('กรุณาเลือกระดับผู้เรียน');
        if (!budget || Number(budget) <= 0) return setError('กรุณาระบุงบประมาณที่ถูกต้อง');
        if (selectedDays.length === 0) return setError('กรุณาเลือกอย่างน้อย 1 วัน');

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
            setError(err.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
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
                        บอกความต้องการของคุณ
                    </h1>
                    <p className="text-sm text-text-sub mb-8 leading-relaxed">
                        ให้ AI ของเราช่วยวิเคราะห์และคัดสรรติวเตอร์ที่ตรงกับ
                        สไตล์การเรียนและเป้าหมายของคุณมากที่สุด
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Field 1: วิชา */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                วิชาที่อยากเรียน
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="เช่น ฟิสิกส์ ม.ปลาย, สนทนาภาษาอังกฤษ, เขียนโค้ด Python"
                                className={inputCls}
                            />
                        </div>

                        {/* Field 2: ระดับผู้เรียน */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                ระดับผู้เรียน
                            </label>
                            <select
                                value={skillLevel}
                                onChange={(e) => setSkillLevel(e.target.value)}
                                className={`${inputCls} cursor-pointer`}
                            >
                                {SKILL_LEVELS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Field 3: งบประมาณ */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1.5">
                                งบประมาณต่อชั่วโมง
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="ระบุตัวเลข เช่น 350, 500"
                                    min="0"
                                    className={`${inputCls} pr-16`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                                    บาท/ชม.
                                </span>
                            </div>
                        </div>

                        {/* Field 4: วันที่ว่าง (toggle buttons) */}
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-2">
                                วันที่สะดวกเรียน
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_DAYS.map((day) => {
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
                                            {day.label}
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
                                    กำลังวิเคราะห์...
                                </span>
                            ) : 'ค้นหา tutor ที่ใช่'}
                        </button>
                    </form>
                </div>

                {/* Security note */}
                <p className="text-center text-xs text-text-muted mt-4 flex items-center justify-center gap-1">
                    🔒 ข้อมูลของคุณจะถูกนำเข้าสู่ระบบเพื่อค้นหาติวเตอร์ที่เหมาะสมอย่างเป็นส่วนตัว
                </p>
            </main>
        </div>
    );
}
