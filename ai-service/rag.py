import os
from dotenv import load_dotenv
import google.generativeai as genai
from models import Tutor
from vector_search import search_similar_tutors

# โหลด .env file
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



def retrieve_context(question: str, top_k: int = 3) -> list[Tutor]:
    """
    ค้นหา tutors ที่เกี่ยวข้องกับ question มากที่สุด
    โดยใช้ semantic search จาก Phase 4

    Args:
        question: คำถามหรือความต้องการของนักเรียน
        top_k: จำนวน tutor ที่จะดึงมา (default 3)

    Returns:
        list ของ Tutor objects ที่เกี่ยวข้องมากที่สุด
    """
    results = search_similar_tutors(question, top_k=top_k)

    # แยกแค่ tutor object ออกมา (ทิ้ง similarity score)
    return [r["tutor"] for r in results]

def build_rag_prompt(question: str, retrieved_tutors: list[Tutor]) -> dict:
    """
    สร้าง prompt สำหรับส่งให้ LLM
    คืน dict แยก system กับ user เพราะ LLM API ส่วนใหญ่ต้องการแบบนี้
    """
    # สร้าง context จากข้อมูล tutor จริง
    context_parts = []
    for i, tutor in enumerate(retrieved_tutors, 1):
        reviews_text = " | ".join(tutor.reviews)
        context_parts.append(
            f"ติวเตอร์คนที่ {i}: {tutor.name}\n"
            f"  วิชาที่สอน: {', '.join(tutor.subjects)}\n"
            f"  ราคา: {tutor.price_per_hour} บาท/ชั่วโมง\n"
            f"  rating: {tutor.rating}/5.0\n"
            f"  ประสบการณ์: {tutor.experience_years} ปี\n"
            f"  แนะนำตัว: {tutor.bio}\n"
            f"  วิธีสอน: {tutor.teaching_style}\n"
            f"  รีวิว: {reviews_text}"
        )

    context = "\n\n".join(context_parts)

    system_prompt = (
        "คุณคือผู้ช่วยแนะนำติวเตอร์ของระบบ Tutee "
        "ตอบคำถามจากข้อมูลติวเตอร์ที่ได้รับเท่านั้น "
        "ถ้าข้อมูลไม่เพียงพอให้บอกตรงๆ ว่าไม่มีข้อมูลเพียงพอ "
        "ตอบเป็นภาษาไทย กระชับ และเป็นประโยชน์"
    )

    user_message = (
        f"ข้อมูลติวเตอร์ที่เกี่ยวข้อง:\n\n{context}\n\n"
        f"คำถาม: {question}"
    )

    return {
        "system": system_prompt,
        "user": user_message
    }

def generate_answer(question: str, retrieved_tutors: list[Tutor] | None = None) -> str:
    """
    RAG pipeline:
    1. retrieve_context  → ดึง tutor ที่เกี่ยวข้อง (ถ้ายังไม่ได้ส่งเข้ามา)
    2. build_rag_prompt  → สร้าง prompt จากข้อมูลจริง
    3. เรียก Gemini API  → ได้คำตอบ
    """
    # 1. ถ้าไม่ได้ส่ง tutors เข้ามา ให้ค้นหาใหม่
    if retrieved_tutors is None:
        retrieved_tutors = retrieve_context(question, top_k=3)

    # 2. สร้าง prompt
    prompt_dict = build_rag_prompt(question, retrieved_tutors)

    # 3. เรียก Gemini
    model = genai.GenerativeModel(
        model_name="gemini-3.6-flash",
        system_instruction=prompt_dict["system"],
        generation_config=genai.GenerationConfig(
            temperature=0.3,       # ตรงประเด็น ไม่แต่งเพิ่ม
            max_output_tokens=2048 # ขยายพื้นที่ให้ AI คิดและตอบได้อย่างครบถ้วน
        )
    )

    response = model.generate_content(prompt_dict["user"])
    return response.text
