// ──────────────────────────────────────────────────────────────
// Shared SVG Icon Library
// Style: line-based, stroke only, strokeWidth 1.8-2
// Usage: <IconStar size={16} /> or wrap in <IconBox><IconStar/></IconBox>
// ──────────────────────────────────────────────────────────────

const RED = '#C0392B';

// ── Wrapper: icon + red bg box ──
export function IconBox({ children, size = 40 }) {
    return (
        <div
            className="bg-brand-red-light rounded-lg flex items-center justify-center shrink-0"
            style={{ width: size, height: size }}
        >
            {children}
        </div>
    );
}

// ── Individual Icons ──

export function IconTarget({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
    );
}

export function IconChart({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
    );
}

export function IconChat({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    );
}

export function IconBook({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
}

export function IconCoin({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v2m0 8v2M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5m0 1h.01"/>
        </svg>
    );
}

export function IconStar({ size = 16, filled = false }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? RED : 'none'} stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    );
}

export function IconCalendar({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    );
}

export function IconSearch({ size = 48 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    );
}

export function IconCheck({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    );
}

export function IconLock({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    );
}
