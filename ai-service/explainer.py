import os
from dotenv import load_dotenv
import google.generativeai as genai
from models import Tutor, StudentRequirement
from scorer import (
    calculate_match_score,
    subject_match_score,
    price_match_score,
    availability_score,
    rating_score,
)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def build_score_breakdown(requirement: StudentRequirement, tutor: Tutor) -> dict:
    """
    คำนวณคะแนนแยกทุก component แล้วคืนเป็น dict
    เพื่อให้ฟังก์ชันอื่นนำไปใช้ต่อได้ง่าย
    """
    # คำนวณ skill score ด้วย logic เดิมจาก scorer.py
    skill_order = {"beginner": 0, "intermediate": 1, "advanced": 2}
    req_level = skill_order.get(requirement.skill_level, 0)
    tutor_level = skill_order.get(tutor.skill_level, 0)

    if tutor_level < req_level:
        s_skill = 0.0
    elif tutor_level == req_level:
        s_skill = 1.0
    else:
        gap = tutor_level - req_level
        s_skill = 1.0 / (2 ** gap)

    return {
        "subject_score": round(subject_match_score(requirement, tutor), 4),
        "skill_score":   round(s_skill, 4),
        "rating_score":  round(rating_score(tutor), 4),
        "price_score":   round(price_match_score(requirement, tutor), 4),
        "avail_score":   round(availability_score(requirement, tutor), 4),
        "total_score":   round(calculate_match_score(requirement, tutor), 4),
    }


def build_explanation_prompt(
    requirement: StudentRequirement,
    tutor: Tutor,
    score_breakdown: dict,
) -> str:
    """
    สร้าง prompt ที่บอก LLM ว่า:
    - นักเรียนต้องการอะไร
    - ติวเตอร์มีคุณสมบัติอะไร
    - คะแนนแยกแต่ละด้านเป็นเท่าไร (ตัวเลขจริงจากระบบ)

    LLM มีหน้าที่เพียง "เรียบเรียงเป็นภาษาคน"
    ไม่ได้ให้ LLM คิดคะแนนเองเลย!
    """
    # แปลง score 0-1 เป็นเปอร์เซ็นต์ให้อ่านง่าย
    def pct(val: float) -> str:
        return f"{int(val * 100)}%"

    prompt = (
        f"นักเรียนต้องการ:\n"
        f"  - วิชา: {requirement.subject}\n"
        f"  - ระดับ: {requirement.skill_level}\n"
        f"  - งบ: {requirement.budget_per_hour} บาท/ชม.\n"
        f"  - วันที่ว่าง: {', '.join(requirement.available_days)}\n"
        f"\n"
        f"ข้อมูลติวเตอร์ที่แนะนำ: {tutor.name}\n"
        f"  - วิชาที่สอน: {', '.join(tutor.subjects)}\n"
        f"  - ระดับ: {tutor.skill_level}\n"
        f"  - ราคา: {tutor.price_per_hour} บาท/ชม.\n"
        f"  - ว่าง: {', '.join(tutor.availability)}\n"
        f"  - Rating: {tutor.rating}/5.0\n"
        f"\n"
        f"คะแนนความเหมาะสมที่ระบบคำนวณได้ (ตัวเลขจริง ห้ามเปลี่ยน):\n"
        f"  - วิชาตรงกัน:     {pct(score_breakdown['subject_score'])}\n"
        f"  - ระดับตรงกัน:    {pct(score_breakdown['skill_score'])}\n"
        f"  - ความน่าเชื่อถือ: {pct(score_breakdown['rating_score'])}\n"
        f"  - ความเหมาะงบ:    {pct(score_breakdown['price_score'])}\n"
        f"  - วันที่ว่างตรง:   {pct(score_breakdown['avail_score'])}\n"
        f"  - คะแนนรวม:       {pct(score_breakdown['total_score'])}\n"
        f"\n"
        f"จากตัวเลขข้างต้น (ห้ามเปลี่ยนแปลงตัวเลข) ขอให้เรียบเรียงเป็นคำอธิบาย "
        f"ภาษาไทย 2-3 ประโยค ว่าทำไมระบบถึงแนะนำติวเตอร์คนนี้ "
        f"เน้นจุดเด่นที่ได้คะแนนสูง และพูดถึงจุดที่ได้คะแนนน้อยถ้ามี"
    )

    return prompt

def explain_recommendation(
    requirement: StudentRequirement,
    tutor: Tutor,
) -> tuple[str, dict]:
    """
    Pipeline ครบวงจรของ Explainable Recommendation:
    1. คำนวณ score breakdown จากระบบ (ตัวเลขจริง)
    2. สร้าง prompt พร้อมตัวเลข
    3. เรียก Gemini ให้เรียบเรียงเป็นภาษาคน

    Returns:
        tuple (explanation: str, score_breakdown: dict)
        คืนทั้ง 2 อย่างเพื่อให้ Frontend แสดงผลทั้ง
        คำอธิบายและตัวเลข breakdown คู่กันได้
    """
    # 1. คำนวณตัวเลขจริงก่อน (ระบบคิด ไม่ใช่ LLM)
    breakdown = build_score_breakdown(requirement, tutor)

    # 2. สร้าง prompt พร้อมข้อมูลครบ
    prompt = build_explanation_prompt(requirement, tutor, breakdown)

    # 3. เรียก Gemini ให้แค่เรียบเรียงภาษา
    model = genai.GenerativeModel(
        model_name="gemini-3.6-flash",
        system_instruction=(
            "คุณคือผู้ช่วยอธิบายผลการแนะนำของระบบ Tutee "
            "ห้ามคิดคะแนนใหม่หรือเปลี่ยนแปลงตัวเลขที่ได้รับ "
            "มีหน้าที่เพียงเรียบเรียงข้อมูลที่ได้รับเป็นภาษาคนที่อ่านง่าย "
            "ตอบเป็นภาษาไทย กระชับ ไม่เกิน 3 ประโยค"
        ),
        generation_config=genai.GenerationConfig(
            temperature=0.1,       # ต่ำมาก เพราะต้องการ factual ไม่ creative
            max_output_tokens=1024  # คำอธิบายสั้น ไม่ต้องยาว
        )
    )

    response = model.generate_content(prompt)
    return response.text, breakdown

