/**
 * Design System Tokens
 * แก้ไขที่นี่ที่เดียว ทุก Component เปลี่ยนตาม
 */

export const COLORS = {
    // Backgrounds
    pageBg: '#FAF3EA',       // ครีม - พื้นหลักของทุกหน้า
    cardBg: '#FFFFFF',       // ขาว - พื้นการ์ด
    cardBgAlt: '#FDF8F2',    // ครีมอ่อน - การ์ด alternate

    // Accent
    accent: '#C0392B',       // แดง - ปุ่มหลัก, Badge, Underline
    accentHover: '#A93226',  // แดงเข้ม - hover state
    accentLight: '#FAE5E3',  // แดงอ่อนมาก - background ของ badge

    // Text
    textPrimary: '#1C1C1C',  // ดำ - หัวข้อ, เนื้อหาหลัก
    textSecondary: '#6B6B6B',// เทา - subtitle, description
    textMuted: '#9E9E9E',    // เทาอ่อน - placeholder, timestamp

    // Border
    border: '#E8DDD0',       // ขอบการ์ด (1px, ครีมน้ำตาล)
    borderLight: '#F0E8DF',  // ขอบอ่อนมาก

    // Status
    success: '#27AE60',
    online: '#2ECC71',       // จุดสีเขียว (online indicator)

    // Neutral
    white: '#FFFFFF',
    black: '#1C1C1C',
};

export const FONTS = {
    serif: "'Fraunces', 'Lora', Georgia, serif",    // หัวข้อใหญ่
    sans: "'Inter', system-ui, -apple-system, sans-serif",  // เนื้อหาทั่วไป
};

export const BREAKPOINTS = {
    mobile: '640px',    // < 640px  = mobile
    tablet: '1024px',   // 640-1024 = tablet
    desktop: '1024px',  // > 1024px = desktop
};

export const SHADOWS = {
    none: 'none',       // Design spec: ไม่มี shadow
    subtle: '0 1px 3px rgba(0,0,0,0.06)',  // ใช้เฉพาะกรณีจำเป็น
};
