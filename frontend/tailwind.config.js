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
                'cream':          '#F2F0E4',  // พื้นหลัก (Off-white warm)
                'cream-dark':     '#F2A2A2',  // พื้นหลัง section รอง (Blush Pink)
                'card':           '#FFFFFF',  // การ์ดขาว
                'border-soft':    '#E5BCBC',  // เส้นขอบ (warm pink-tinted)
                'brand-red':      '#8C1822',  // Primary accent
                'brand-red-dark': '#730D0D',  // Hover state
                'brand-red-light':'#FAE3E3',  // Icon bg / badge tint
                'brand-deep':     '#400808',  // Deep Burgundy (shadow/text)
                'text-main':      '#2A0A0A',  // หัวข้อ (warm near-black)
                'text-sub':       '#6B3030',  // คำอธิบาย (warm mid)
                'text-muted':     '#A07070',  // placeholder
                'online':         '#2ECC71',  // สีออนไลน์
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
