import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { askTutee } from '../api/client';

// แปลง Day code → ชื่อย่อ
const DAY_MAP = { Mon:'จ', Tue:'อ', Wed:'พ', Thu:'พฤ', Fri:'ศ', Sat:'ส', Sun:'อา' };

// Bubble สำหรับ tutor card ที่ AI แนบมากับคำตอบ
function TutorCardInChat({ tutor }) {
    return (
        <div className="card p-4 mt-2 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-red-light flex items-center justify-center text-brand-red font-bold font-serif">
                    {tutor.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-sm text-text-main">{tutor.name}</p>
                    <p className="text-xs text-text-sub flex items-center gap-1">
                        ⭐ {tutor.rating}
                        {tutor.review_count && <span>({tutor.review_count}+ รีวิว)</span>}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
                {tutor.subjects?.map((s) => (
                    <span key={s} className="text-[11px] bg-brand-red-light text-brand-red px-2 py-0.5 rounded-full">{s}</span>
                ))}
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-main">{tutor.price_per_hour} / ชั่วโมง</p>
                <Link to={`/tutor/${tutor.id}`} className="btn-primary text-xs px-3 py-1.5">
                    ดูโปรไฟล์
                </Link>
            </div>
        </div>
    );
}

// Bubble ข้อความ
function ChatBubble({ message }) {
    const isUser = message.role === 'user';
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}>
            <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[75%] ${
                    isUser
                        ? 'bg-brand-red text-white rounded-br-sm'
                        : 'bg-white border border-border-soft text-text-main rounded-bl-sm'
                }`}
            >
                {message.text}
            </div>

            {/* Tutor cards แนบท้ายถ้า AI ส่ง sources มา */}
            {!isUser && message.sources?.length > 0 && (
                <div className="flex flex-col gap-2">
                    {message.sources.map((tutor) => (
                        <TutorCardInChat key={tutor.id} tutor={tutor} />
                    ))}
                </div>
            )}

            <span className="text-[10px] text-text-muted px-1">{message.time}</span>
        </div>
    );
}

const INITIAL_MESSAGES = [
    {
        role: 'ai',
        text: 'สวัสดี! บอกวิชา ระดับชั้น และเป้าหมายที่อยากพัฒนาได้เลย 😊',
        time: '',
        sources: [],
    },
];

export default function TuteeChat() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput]       = useState('');
    const [loading, setLoading]   = useState(false);
    const bottomRef = useRef(null);

    // Auto-scroll ไปที่ล่างสุดทุกครั้งที่มีข้อความใหม่
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getTime = () => new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        // เพิ่ม user bubble
        const userMsg = { role: 'user', text, time: getTime(), sources: [] };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await askTutee(text);

            // เพิ่ม AI bubble พร้อม sources
            const aiMsg = {
                role: 'ai',
                text: data.answer,
                time: getTime(),
                sources: data.sources || [],
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'ai', text: 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', time: getTime(), sources: [] },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col">
            {/* Header (เหมือน mobile app) */}
            <header className="bg-cream border-b border-border-soft sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link to="/" className="text-text-sub hover:text-text-main text-sm">←</Link>
                    <div className="text-center">
                        <p className="font-semibold text-sm text-text-main">ถาม Tutee</p>
                        <p className="text-[11px] text-online flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-online inline-block" />
                            ติวเตอร์ระบบพร้อมตอบ
                        </p>
                    </div>
                    <Link to="/find" className="text-text-sub hover:text-text-main text-sm">ℹ️</Link>
                </div>
            </header>

            {/* Chat area — max-w-2xl บน desktop */}
            <main className="flex-1 overflow-y-auto py-4 px-4 max-w-2xl mx-auto w-full">
                <div className="flex flex-col gap-5">
                    {messages.map((msg, i) => (
                        <ChatBubble key={i} message={msg} />
                    ))}

                    {/* Loading indicator */}
                    {loading && (
                        <div className="flex items-start gap-2">
                            <div className="bg-white border border-border-soft px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </main>

            {/* Input bar — sticky ด้านล่าง */}
            <div className="border-t border-border-soft bg-cream sticky bottom-0">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="พิมพ์คำถามของคุณ..."
                        disabled={loading}
                        className="flex-1 border border-border-soft rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-text-muted disabled:opacity-60"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="w-10 h-10 rounded-full bg-brand-red hover:bg-brand-red-dark text-white flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                    >
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
}
