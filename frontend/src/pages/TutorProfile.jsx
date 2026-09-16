import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { IconStar, IconCheck } from '../components/Icons';

// Mock tutor data (จะเปลี่ยนเป็น API call จริงในอนาคต)
const TUTOR_DATA = {
    't001': {
        id: 't001',
        name: 'พี่รินดา',
        fullName: 'พี่รินดา (วิศวะ จุฬาฯ)',
        title: 'วิศวกรรมศาสตรบัณฑิต (เกียรตินิยมอันดับ 1)',
        subjects: ['Physics & Calculus', 'ฟิสิกส์ ม.ปลาย', 'PAT3'],
        price_per_hour: 350,
        rating: 4.9,
        reviewCount: 120,
        experience: 5,
        about: 'เน้นปูพื้นฐานจากความเข้าใจจริงๆ ไม่เน้งจำสูตรลัดที่ใช้ได้แค่บางโจทย์ พัฒนาเป็นทั้งนักคิดและปรับความเร็วตามผู้เรียน ปรึกษาแนวข้อสอบ TCAS, PAT1 และ A-Level ได้ตลอด 24 ชม. ครับ มีเอกสารสรุปทำเองแจกฟรีทุกระดับชั้น!',
        highlight: 'สลัดสูตรยาก เปลี่ยนเรื่องยากให้มองเห็นภาพง่าย',
        reviews: [
            { id: 1, student: 'น้องก้อง (ม.6 เตรียมจุฬาฯ)', target: 'ติวสอบเข้า วิศวะ จุฬาฯ', rating: 5, text: 'สอนดีมากครับ จากคนที่ไม่ชอบเลย พี่อธิบายทำให้เข้าใจด้วยวิธีคิด ไม่ใช่ท่องสูตร สอบไม่เคยติดแต่ได้เลย' },
            { id: 2, student: 'คุณแม่น้องบิ๊ม', target: 'เป้าหมาย: พรีเทรต ม.5 เลขเพิ่มเติม', rating: 5, text: 'พักใจดี ใจเย็น และตรงต่อเวลามากครับ ลูกสาวชอบมากเลยค่ะ ขอบคุณครูผู้สอนจริงๆ ค่ะ' },
            { id: 3, student: 'น้องพีช (ม.4 สาธิตปทุมวัน)', target: 'เป้าหมาย: ฟิสิกส์ ม.ปลาย', rating: 5, text: 'พี่อธิบายละเอียดมาก ทำให้รู้สึกสนุกขึ้นเยอะมากเลย สรุปเนื้อหาง่ายยืนยันจริงๆ' },
        ],
        availability: ['Sat', 'Sun'],
    },
    't002': {
        id: 't002',
        name: 'ครูทอมมี่',
        fullName: 'ครูทอมมี่',
        title: 'English for Academic & IELTS',
        subjects: ['English for Academic', 'IELTS', 'TOEFL'],
        price_per_hour: 400,
        rating: 5.0,
        reviewCount: 85,
        experience: 7,
        about: 'เชี่ยวชาญการสอน Academic English และการเตรียมสอบ IELTS/TOEFL ด้วยประสบการณ์กว่า 7 ปี มีเทคนิคพิเศษสำหรับ Writing Task 2 และ Speaking ที่ช่วยเพิ่มคะแนนได้อย่างรวดเร็ว',
        highlight: 'ผ่านการสอนนักเรียนมากกว่า 500 คน คะแนน IELTS เฉลี่ย 7.5+',
        reviews: [
            { id: 1, student: 'น้องมิน (ปี 1 มหาวิทยาลัย)', target: 'เป้าหมาย: IELTS 7.0', rating: 5, text: 'ครูสอนดีมาก เทคนิค Writing ช่วยได้เยอะมากเลยค่ะ' },
        ],
        availability: ['Tue', 'Thu', 'Sat'],
    },
};

const FALLBACK_TUTOR = TUTOR_DATA['t001'];

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <IconStar key={star} size={14} filled={star <= Math.round(rating)} />
            ))}
        </div>
    );
}

export default function TutorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // ① ถ้ามาจากหน้า Results → ใช้ข้อมูลจาก API จริง (ส่งมาผ่าน router state)
    // ② ถ้าเข้า URL ตรงๆ → fallback ไปใช้ Mock Data ใน Component
    const apiTutor  = location.state?.tutor;
    const tutor = apiTutor
        ? { ...apiTutor, fullName: apiTutor.name, title: apiTutor.subjects?.join(' | '), about: apiTutor.explanation || '', highlight: '', reviews: [], reviewCount: 0, experience: '-' }
        : (TUTOR_DATA[id] || FALLBACK_TUTOR);


    return (
        /* pb-24 เผื่อพื้นที่ให้ Sticky CTA ด้านล่าง */
        <div className="min-h-screen bg-cream pb-24">

            {/* ── Header ── */}
            <header className="bg-cream border-b border-border-soft sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-sub">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                    <p className="font-semibold text-sm text-text-main">{t('profile_title')}</p>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-sub group-hover:text-brand-red group-hover:stroke-brand-red transition-colors">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
            </header>


            <main className="max-w-2xl mx-auto px-4 py-8">

                {/* ── Profile Header ── */}
                <div className="flex flex-col items-center text-center mb-6">
                    {/* Avatar with red ring */}
                    <div className="w-24 h-24 rounded-full bg-brand-red-light border-2 border-brand-red flex items-center justify-center text-brand-red font-bold text-4xl font-serif mb-4">
                        {tutor.name.charAt(0)}
                    </div>
                    <h1 className="font-serif text-2xl font-bold text-text-main mb-1">{tutor.fullName}</h1>
                    <p className="text-sm text-text-sub mb-4">{tutor.title}</p>

                    {/* Subject Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tutor.subjects.map((s) => (
                            <span
                                key={s}
                                className="text-xs border border-brand-red text-brand-red px-3 py-1 rounded-full"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── 3 Stats Boxes ── */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { label: t('stat_price_label'), value: `${tutor.price_per_hour}`, unit: t('stat_price_unit') },
                        { label: t('stat_rating_label'), value: `⭐ ${tutor.rating}`, unit: `(${tutor.reviewCount}+)` },
                        { label: t('stat_exp_label'), value: `${tutor.experience} ${t('stat_exp_unit')}`, unit: '' },
                    ].map((stat) => (
                        <div key={stat.label} className="card p-3 text-center">
                            <p className="text-[11px] text-text-sub mb-1">{stat.label}</p>
                            <p className="font-semibold text-text-main text-sm">{stat.value}</p>
                            <p className="text-[11px] text-text-muted">{stat.unit}</p>
                        </div>
                    ))}
                </div>

                {/* ── About / Teaching Style ── */}
                <section className="mb-8">
                    <h2 className="font-serif text-lg font-bold text-text-main mb-3">{t('about_heading')}</h2>
                    <div className="card p-5">
                        <p className="text-sm text-text-sub leading-relaxed mb-4">{tutor.about}</p>
                        <div className="flex items-start gap-2 text-sm text-text-main">
                            <IconCheck size={16} />
                            <p>{tutor.highlight}</p>
                        </div>
                    </div>
                </section>

                {/* ── Reviews ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-serif text-lg font-bold text-text-main">
                            {t('reviews_heading')}
                        </h2>
                        <button className="text-sm text-brand-red hover:underline">
                            {t('reviews_view_all')} ({tutor.reviewCount})
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {tutor.reviews.map((review) => (
                            <div key={review.id} className="card p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <p className="font-semibold text-sm text-text-main">{review.student}</p>
                                        <p className="text-xs text-text-muted">{review.target}</p>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                <p className="text-sm text-text-sub leading-relaxed">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ── Sticky CTA ด้านล่าง ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-border-soft z-50">
                <div className="max-w-2xl mx-auto px-4 py-3">
                    <button className="btn-primary w-full py-4 text-base">
                    {t('btn_contact')}
                </button>
                </div>
            </div>
        </div>
    );
}
