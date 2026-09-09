from rag import generate_answer

# ลองยิงคำถามที่เกี่ยวกับติวเตอร์ในระบบ
question = "อยากหาติวเตอร์สอนคณิต ม.ปลาย ใจดี เน้นปูพื้นฐาน มีใครแนะนำบ้างครับ"

print(f"คำถาม: {question}\n")
print("กำลังค้นหาข้อมูลติวเตอร์และให้ Gemini ประมวลผลคำตอบ (รอสักครู่)...")

try:
    answer = generate_answer(question)
    print("\n" + "="*50)
    print("คำตอบจาก Tutee AI:")
    print("="*50)
    print(answer)
except Exception as e:
    print(f"\nเกิดข้อผิดพลาด: {e}")
