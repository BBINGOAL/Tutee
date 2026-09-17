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
    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            system_instruction=(
                "คุณคือผู้ช่วยอธิบายผลการแนะนำของระบบ Tutee "
                "ห้ามคิดคะแนนใหม่หรือเปลี่ยนแปลงตัวเลขที่ได้รับ "
                "มีหน้าที่เพียงเรียบเรียงข้อมูลที่ได้รับเป็นภาษาคนที่อ่านง่าย "
                "ตอบเป็นภาษาไทย กระชับ ไม่เกิน 3 ประโยค"
            ),
            generation_config=genai.GenerationConfig(
                temperature=0.1,
                max_output_tokens=1024
            )
        )
        response = model.generate_content(prompt)
        explanation = response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        explanation = "ระบบวิเคราะห์ความเหมาะสมสำเร็จ (AI กำลังรับภาระหนัก ไม่สามารถสร้างคำอธิบายแบบละเอียดได้ในขณะนี้)"

    return explanation, breakdown

def explain_recommendation_batch(
    requirement: StudentRequirement,
    tutors: list[Tutor]
) -> list[tuple[str, dict]]:
    """
    รับ Tutor หลายคน (มักจะเป็น Top 3) แล้วเรียก Gemini ครั้งเดียว
    ประหยัด API Quota ไป 3 เท่า!
    """
    # 1. คำนวณ breakdown ของแต่ละคน
    breakdowns = [build_score_breakdown(requirement, t) for t in tutors]
    
    # 2. สร้าง prompt รวม
    prompt = (
        f"นักเรียนต้องการ:\n"
        f"  - วิชา: {requirement.subject}\n"
        f"  - ระดับ: {requirement.skill_level}\n"
        f"  - งบ: {requirement.budget_per_hour} บาท/ชม.\n"
        f"  - วันที่ว่าง: {', '.join(requirement.available_days)}\n\n"
    )

    def pct(val: float) -> str: return f"{int(val * 100)}%"
    
    for i, (t, b) in enumerate(zip(tutors, breakdowns)):
        prompt += f"--- ติวเตอร์คนที่ {i+1}: {t.name} ---\n"
        prompt += f"  - วิชาที่สอน: {', '.join(t.subjects)}\n"
        prompt += f"  - ระดับ: {t.skill_level}, ราคา: {t.price_per_hour}, ว่าง: {', '.join(t.availability)}\n"
        prompt += f"คะแนน: วิชา {pct(b['subject_score'])}, ระดับ {pct(b['skill_score'])}, "
        prompt += f"ราคา {pct(b['price_score'])}, เวลา {pct(b['avail_score'])}, รวม {pct(b['total_score'])}\n\n"

    prompt += (
        "จากข้อมูลทั้งหมด ขอให้เขียนคำอธิบายภาษาไทยสั้นๆ 2-3 ประโยค ให้กับติวเตอร์แต่ละคน ว่าทำไมถึงแนะนำ\n"
        "สำคัญมาก: ให้คั่นคำอธิบายของแต่ละคนด้วยคำว่า ||| เท่านั้น ห้ามใส่ข้อความอื่นหรือเว้นบรรทัดที่ไม่จำเป็น\n"
        "ตัวอย่างผลลัพธ์:\n"
        "คำอธิบายคนที่1\n|||\nคำอธิบายคนที่2\n|||\nคำอธิบายคนที่3"
    )

    # 3. เรียก Gemini
    explanations = []
    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.6-flash",
            system_instruction="คุณคือผู้ช่วยอธิบายผลแนะนำติวเตอร์ ห้ามเปลี่ยนแปลงตัวเลขคะแนน และต้องใช้สัญลักษณ์ ||| คั่นระหว่างคนเท่านั้น",
            generation_config=genai.GenerationConfig(temperature=0.1, max_output_tokens=2048)
        )
        response = model.generate_content(prompt)
        # ตัดแบ่งด้วย |||
        parts = [p.strip() for p in response.text.split("|||")]
        
        # ถ้า AI ตอบมาครบจำนวนคน
        if len(parts) >= len(tutors):
            explanations = parts[:len(tutors)]
        else:
            raise ValueError("AI returned fewer explanations than expected.")
            
    except Exception as e:
        print(f"Gemini Batch API Error: {e}")
        # Fallback 
        fallback_msg = "ระบบวิเคราะห์ความเหมาะสมสำเร็จ (AI กำลังรับภาระหนัก ไม่สามารถสร้างคำอธิบายแบบละเอียดได้)"
        explanations = [fallback_msg] * len(tutors)
        
    # คืนค่ากลับไปเป็น List ของ Tuple (explanation, breakdown)
    return [(explanations[i], breakdowns[i]) for i in range(len(tutors))]
