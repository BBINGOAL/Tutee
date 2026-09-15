import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ backLabel, backTo }) {
    const location = useLocation();
    const isLanding = location.pathname === '/';

    return (
        <nav className="bg-cream border-b border-border-soft sticky top-0 z-50">
            <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <span className="font-serif text-xl font-bold text-brand-red">Tutee</span>
                    <span className="text-[11px] font-medium bg-brand-red-light text-brand-red px-2 py-[2px] rounded-full tracking-wide">
                        AI Powered
                    </span>
                </Link>

                {/* Desktop: nav links | Other pages: back button */}
                {isLanding ? (
                    <div className="flex items-center gap-7">
                        <Link to="/find" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">ค้นหาติวเตอร์</Link>
                        <Link to="/chat" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">วิธีการใช้</Link>
                        <a href="#" className="hidden md:block text-sm text-text-sub hover:text-text-main transition-colors">สำหรับติวเตอร์</a>
                        <Link to="/find" className="btn-primary text-sm px-5 py-2">เข้าสู่ระบบ</Link>
                    </div>
                ) : (
                    <Link to={backTo || '/'} className="btn-outline text-sm px-4 py-2">
                        ← {backLabel || 'กลับหน้าหลัก'}
                    </Link>
                )}
            </div>
        </nav>
    );
}
