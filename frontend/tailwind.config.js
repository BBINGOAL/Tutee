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
                'cream':          '#FAF3EA',  // พื้นหลังหลัก → bg-cream
                'cream-dark':     '#F0E8DF',  // พื้นหลัง section ทึบ
                'card':           '#FFFFFF',  // การ์ด → bg-card
                'border-soft':    '#E8DDD0',  // เส้นขอบ → border-border-soft
                'brand-red':      '#C0392B',  // accent → bg-brand-red, text-brand-red
                'brand-red-dark': '#A93226',  // hover → hover:bg-brand-red-dark
                'brand-red-light':'#FAE5E3',  // badge bg → bg-brand-red-light
                'text-main':      '#1C1C1C',  // หัวข้อ → text-text-main
                'text-sub':       '#6B6B6B',  // คำอธิบาย → text-text-sub
                'text-muted':     '#9E9E9E',  // placeholder → text-text-muted
                'online':         '#2ECC71',  // สีจุดเขียว
            },

            // ===== Custom Fonts =====
            fontFamily: {
                // font-serif → Fraunces (heading, numbers, Latin text)
                serif: ['Fraunces', 'Georgia', 'serif'],
                // font-sans → IBM Plex Sans Thai (body, Thai text ทุก element)
                sans:  ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'],
            },

            // ===== Max Width =====
            maxWidth: {
                'content': '1100px',  // max-w-content → container ของเรา
            },
        },
    },
    plugins: [],
};
