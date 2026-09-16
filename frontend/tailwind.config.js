/** @type {import('tailwindcss').Config} */
export default {
    // บอก Tailwind ให้สแกนหา class ใน src/ ทั้งหมด
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            // ===== Custom Colors =====
            colors: {
                'cream':          '#E5D1C5',  // พื้นหลังหลัก (Warm Cream)
                'cream-dark':     '#D4BFB2',  // section ทึบเข้มขึ้นหน่อย
                'card':           '#FFFFFF',  // การ์ด (ขาวเพื่ออ่านง่าย)
                'border-soft':    '#C9B0A5',  // เส้นขอบ warm tone
                'brand-red':      '#8E1617',  // Primary accent (Dark Red)
                'brand-red-dark': '#550808',  // Hover state (Very Dark Red)
                'brand-red-light':'#F5E0DC',  // Icon bg / badge tint
                'brand-deep':     '#6B0B0C',  // Deep Burgundy (ตัวเลข/heading เข้ม)
                'text-main':      '#2C1010',  // หัวข้อ (warm dark)
                'text-sub':       '#6B4A4A',  // คำอธิบาย (warm gray)
                'text-muted':     '#9E8080',  // placeholder (warm muted)
                'online':         '#2ECC71',  // สีจุดเขียว
            },

            // ===== Custom Fonts =====
            fontFamily: {
                // font-serif → Ubuntu Bold (heading, ตัวเลข, ชื่อ)
                // Ubuntu ไม่มี Thai → browser fallback ไป Kanit โดยอัตโนมัติ
                serif: ['Ubuntu', 'Kanit', 'sans-serif'],
                // font-sans → Ubuntu + Kanit (body text ทั้ง EN และ TH)
                sans:  ['Ubuntu', 'Kanit', 'sans-serif'],
            },

            // ===== Max Width =====
            maxWidth: {
                'content': '1100px',  // max-w-content → container ของเรา
            },
        },
    },
    plugins: [],
};
