import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FEATURES = [
    {
        icon: '🎯',
        title: 'แมะตรงจิ้ง',
        desc: 'ระบบวิเคราะห์ความต้องการของคุณและจับคู่ติวเตอร์ที่เหมาะสมที่สุดแบบอัตโนมัติ',
    },
    {
        icon: '📊',
        title: 'อธิบายเหตุผลได้',
        desc: 'ไม่ใช่แค่บอกว่าเหมาะ แต่บอกด้วยว่าทำไม พร้อมคะแนนในแต่ละด้านที่ชัดเจน',
    },
    {
        icon: '💬',
        title: 'คาดไม่แมะแยก',
        desc: 'ถามตอบกับ AI ของเราได้ตลอดเวลา เพื่อค้นหาติวเตอร์ที่ใช่ยิ่งขึ้น',
    },
];

const HOW_IT_WORKS = [
    { num: '01', title: 'บอกสิ่งที่คุณต้องการ', desc: 'แจ้งวิชา ระดับ งบประมาณ และเวลาที่สะดวก' },
    { num: '02', title: 'AI วิเคราะห์และแนะนำอย่างชาญฉลาด', desc: 'ระบบค้นหาติวเตอร์ที่ตรงกับทุกเงื่อนไขของคุณ' },
    { num: '03', title: 'ติดต่อและเริ่มต้นทันที', desc: 'เลือกติวเตอร์ที่ถูกใจ นัดหมาย และเริ่มเรียนได้เลย' },
];

const TOP_TUTORS = [
    { id: 't001', name: 'พี่รินดา', subject: 'Physics & Calculus', rating: 4.9, price: 350 },
    { id: 't002', name: 'ครูทอมมี่', subject: 'English for Academic', rating: 5.0, price: 400 },
    { id: 't003', name: 'ครูพิชญ์', subject: 'Chemistry & Bio', rating: 4.8, price: 350 },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-cream">
            <Navbar />

            {/* ── Hero ── */}
            <section className="py-20 md:py-28 text-center">
                <div className="max-w-content mx-auto px-6">
                    <p className="section-eyebrow">AI-Powered Tutor Matching</p>
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-text-main leading-tight mt-2 mb-6">
                        หา tutor ที่ใช่<br />ด้วย AI
                    </h1>
                    <p className="text-text-sub text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        แพลตฟอร์มค้นหาติวเตอร์ที่ใช้ระบบอัจฉริยะวิเคราะห์ความต้องการ
                        และสไตล์การเรียนของคุณเพื่อจับคู่ติวเตอร์ที่ดีที่สุด
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/find" className="btn-primary w-full sm:w-auto">
                            วิเคราะห์ผู้เรียนด้วยระบบอัจฉริยะ
                        </Link>
                        <a href="#top-matches" className="btn-outline w-full sm:w-auto">
                            ดูรายชื่อติวเตอร์ทั้งหมด
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Features (3 cards responsive grid) ── */}
            {/* grid-cols-1 = mobile 1 ใบ, md:grid-cols-3 = tablet+desktop 3 ใบ */}
            <section className="py-16 bg-cream-dark">
                <div className="max-w-content mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="card p-6">
                                <span className="text-3xl mb-4 block">{f.icon}</span>
                                <h3 className="font-serif text-lg font-semibold text-text-main mb-2">{f.title}</h3>
                                <p className="text-sm text-text-sub leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-20">
                <div className="max-w-content mx-auto px-6">
                    {/* 2-column on desktop, 1-column on mobile */}
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-2/5">
                            <p className="section-eyebrow">HOW IT WORKS</p>
                            <h2 className="font-serif text-4xl font-bold text-text-main leading-snug mt-2 mb-4">
                                3 ขั้นตอนง่ายๆ<br />เพื่อเริ่มรู้จักติวเตอร์<br />ในอุดมคติ
                            </h2>
                            <p className="text-text-sub text-sm leading-relaxed">
                                ระบบของเราใช้ AI ช่วยค้นหาติวเตอร์ที่เหมาะกับคุณที่สุด
                                ทั้งด้านวิชา ระดับ งบประมาณ และเวลาที่ว่าง
                            </p>
                        </div>
                        <div className="lg:w-3/5 flex flex-col gap-8">
                            {HOW_IT_WORKS.map((step) => (
                                <div key={step.num} className="flex gap-5 items-start">
                                    <span className="text-3xl font-serif font-bold text-brand-red shrink-0 w-12">
                                        {step.num}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-text-main mb-1">{step.title}</h4>
                                        <p className="text-sm text-text-sub">{step.desc}</p>
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
                            <p className="section-eyebrow">TOP MATCHES</p>
                            <h2 className="font-serif text-3xl font-bold text-text-main mt-1">ติวเตอร์แนะนำสัปดาห์นี้</h2>
                        </div>
                        <Link to="/find" className="text-sm text-text-sub hover:text-brand-red transition-colors">
                            ดูทั้งหมด →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {TOP_TUTORS.map((t) => (
                            <div key={t.id} className="card p-5 flex flex-col gap-4">
                                {/* Avatar placeholder */}
                                <div className="w-14 h-14 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red font-bold text-xl font-serif">
                                    {t.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-text-main">{t.name}</h3>
                                    <p className="text-sm text-text-sub mt-0.5">{t.subject}</p>
                                    <div className="flex gap-3 mt-2 text-sm text-text-sub">
                                        <span>⭐ {t.rating}</span>
                                        <span>{t.price} บาท/ชม.</span>
                                    </div>
                                </div>
                                <Link to={`/tutor/${t.id}`} className="btn-outline text-sm text-center py-2">
                                    ดูโปรไฟล์
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
                        ให้ AI<br />ของเราค้นหาคำตอบและ<br />ติวเตอร์ที่แท้จริงให้คุณวันนี้
                    </h2>
                    <p className="text-text-sub mb-8">
                        ไม่มีค่าธรรมเนียมแรกเข้า เริ่มต้นได้ฟรี พร้อมรับการแนะนำที่แม่นยำทันที
                    </p>
                    <Link to="/find" className="btn-primary text-base px-8 py-4">เริ่มต้นใช้งาน 1 คลิก</Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-cream-dark border-t border-border-soft py-12">
                <div className="max-w-content mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        <div className="col-span-2 md:col-span-1">
                            <span className="font-serif text-xl font-bold text-brand-red block mb-3">Tutee</span>
                            <p className="text-xs text-text-sub leading-relaxed">
                                ระบบจับคู่และการศึกษาที่ใช้ AI อย่างล้ำ<br />
                                เพื่อความก้าวหน้าของผู้เรียนและติวเตอร์ไทย
                            </p>
                        </div>
                        {[
                            { title: 'สำหรับนักเรียน', links: ['ค้นหาติวเตอร์', 'ประเมินผลตนเอง'] },
                            { title: 'สำหรับผู้สอน', links: ['สมัครเป็นติวเตอร์'] },
                            { title: 'เกี่ยวกับเรา', links: ['ติดต่อเรา'] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h5 className="font-semibold text-sm text-text-main mb-3">{col.title}</h5>
                                {col.links.map((l) => (
                                    <a key={l} href="#" className="block text-sm text-text-sub hover:text-brand-red mb-1.5 transition-colors">{l}</a>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border-soft pt-6 text-xs text-text-muted">
                        © 2025 Tutee Co., Ltd. สงวนสิทธิ์ทั้งหมด
                    </div>
                </div>
            </footer>
        </div>
    );
}
