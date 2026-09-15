import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock data สำหรับทดสอบ UI (จะลบออกเมื่อต่อ API จริง)
const MOCK_RESULTS = [
    {
        rank: 1,
        id: 't001',
        name: 'พี่รินดา',
        subjects: ['Physics', 'Calculus'],
        price_per_hour: 350,
        rating: 4.9,
        availability: ['Sat', 'Sun'],
        total_score: 0.98,
        explanation: 'ตรงกับสไตล์การสอนแบบไทยที่เน้นความเข้าใจจริงๆ ไม่ใช่ท่องสูตร ระบบสอดคล้องกับความต้องการเน้นสอน ม.ปลาย ของคุณ อีกทั้งมีระดับราคาที่ตรงกับงบประมาณที่กำหนด',
    },
    {
        rank: 2,
        id: 't002',
        name: 'ครูทอมมี่',
        subjects: ['English for Academic'],
        price_per_hour: 400,
        rating: 5.0,
        availability: ['Tue', 'Thu'],
        total_score: 0.92,
        explanation: 'เหมาะสำหรับผู้ต้องการปรับพื้นฐานภาษาและเพิ่มความมั่นใจในการสนทนาด้วยบทเรียนจริง ครูทอมมี่มีคะแนนรีวิวด้านความเป็นกันเองและทามอนสนับสนุนเต็ม 5.0',
    },
    {
        rank: 3,
        id: 't003',
        name: 'ครูพิชญ์',
        subjects: ['Chemistry', 'Bio'],
        price_per_hour: 350,
        rating: 4.8,
        availability: ['Wed', 'Fri'],
        total_score: 0.85,
        explanation: 'ตอบโจทย์สำหรับผู้เรียนที่ชอบสรุปภาพรวมแบบ Mind Mapping ช่วยสะสระและระเอาสาระและโครงสร้างสร้างความเข้มข้นอย่างมั่นคง',
    },
];

// แปลง Day code → ภาษาไทย
const DAY_MAP = { Mon:'จ', Tue:'อ', Wed:'พ', Thu:'พฤ', Fri:'ศ', Sat:'ส', Sun:'อา' };

function ScoreBar({ score }) {
    const pct = Math.round(score * 100);
    return (
        <div className="text-right">
            <p className="font-serif text-2xl font-bold text-text-main">
                {pct}%
                <span className="font-sans text-sm font-normal text-text-sub ml-1">ตรงกับคุณ</span>
            </p>
            {/* Red underline accent */}
            <div className="h-0.5 bg-brand-red mt-1 ml-auto" style={{ width: `${pct}%`, maxWidth: '120px' }} />
        </div>
    );
}

function TutorCard({ tutor }) {
    return (
        <div className="card p-5 md:p-6">
            {/* Layout: column on mobile, row on desktop */}
            <div className="flex flex-col lg:flex-row gap-5">

                {/* Left: Avatar + Rank badge */}
                <div className="relative shrink-0 self-start">
                    <div className="w-16 h-16 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red font-bold text-2xl font-serif">
                        {tutor.name.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        อันดับ {tutor.rank}
                    </span>
                </div>

                {/* Middle: Info + AI Analysis */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-bold text-text-main mb-1">{tutor.name}</h3>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-3 text-sm text-text-sub mb-3">
                        <span>📚 {tutor.subjects.join(', ')}</span>
                        <span>💰 {tutor.price_per_hour} บาท/ชม.</span>
                        <span>⭐ {tutor.rating}</span>
                        <span>📅 {tutor.availability.map(d => DAY_MAP[d] || d).join(' ')}</span>
                    </div>

                    {/* AI Match Analysis */}
                    <p className="text-brand-red text-xs font-semibold tracking-wider mb-1 border-b border-brand-red inline-block pb-0.5">
                        AI MATCH ANALYSIS
                    </p>
                    <p className="text-sm text-text-sub leading-relaxed mt-1">{tutor.explanation}</p>
                </div>

                {/* Right: Score + Button (แสดงใต้ info บน mobile) */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:gap-3 shrink-0">
                    <ScoreBar score={tutor.total_score} />
                    <Link
                        to={`/tutor/${tutor.id}`}
                        className="btn-outline text-sm whitespace-nowrap px-4 py-2"
                    >
                        ดูโปรไฟล์
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function TutorResults() {
    const location = useLocation();
    const navigate = useNavigate();

    // รับข้อมูลจาก RequirementForm ที่ส่งมาผ่าน navigate('/results', { state: {...} })
    const results     = location.state?.results     ?? MOCK_RESULTS;
    const requirement = location.state?.requirement ?? null;

    // ── ถ้าไม่มี state (เข้าหน้านี้ตรงๆ โดยไม่ผ่าน Form) ──
    if (!location.state) {
        return (
            <div className="min-h-screen bg-cream">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
                    <p className="text-4xl">🔍</p>
                    <h2 className="font-serif text-2xl font-bold text-text-main">ยังไม่มีผลการวิเคราะห์</h2>
                    <p className="text-text-sub text-sm">กรุณากรอกข้อมูลในแบบฟอร์มก่อน</p>
                    <button onClick={() => navigate('/find')} className="btn-primary mt-2">
                        กลับไปกรอกข้อมูล
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-16">
            <Navbar />

            <main className="max-w-content mx-auto px-4 md:px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <p className="section-eyebrow flex items-center gap-1.5">
                        ✨ ANALYSIS COMPLETE
                    </p>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-text-main mt-2 mb-2">
                        Tutor ที่แนะนำสำหรับคุณ
                    </h1>
                    <p className="text-text-sub text-sm">
                        AI วิเคราะห์สไตล์การเรียนรู้และงบประมาณของคุณแล้ว
                        นี่คือติวเตอร์ 3 อันดับแรกที่มีคะแนนความเข้ากันได้สูงที่สุด
                    </p>
                </div>

                {/* Tutor Cards — stacked vertically */}
                <div className="flex flex-col gap-4">
                    {results.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>

                {/* Retry banner */}
                <div className="mt-6 card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm text-text-sub flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                        ต้องการปรับเปลี่ยนวิชาเรียนหรือเวลาที่สะดวกเพื่อให้ AI วิเคราะห์ใหม่หรือไม่?
                    </p>
                    <button
                        onClick={() => navigate('/find')}
                        className="btn-outline text-sm whitespace-nowrap px-4 py-2"
                    >
                        เริ่มวิเคราะห์อีกครั้ง
                    </button>
                </div>
            </main>
        </div>
    );
}
