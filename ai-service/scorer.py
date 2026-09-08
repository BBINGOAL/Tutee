from models import Tutor, StudentRequirement


def subject_match_score(requirement: StudentRequirement, tutor: Tutor) -> float:
    """
    คืนค่า 1.0 ถ้า subject ที่นักเรียนต้องการตรงกับ tutor
    คืนค่า 0.0 ถ้าไม่ตรงเลย
    ใช้ case-insensitive substring matching
    """
    req_subject = requirement.subject.lower()

    for tutor_subject in tutor.subjects:
        if req_subject in tutor_subject.lower() or tutor_subject.lower() in req_subject:
            return 1.0

    return 0.0

def price_match_score(requirement: StudentRequirement, tutor: Tutor) -> float:
    """
    คืนค่า 1.0 ถ้าราคา tutor อยู่ในงบ
    ลดลง linear ถ้าแพงกว่างบ โดย penalty หมดที่ 100% เกินงบ (คืนค่า 0.0)
    """
    budget = requirement.budget_per_hour
    price = tutor.price_per_hour

    if price <= budget:
        return 1.0

    # คำนวณว่าแพงเกินงบกี่เปอร์เซ็นต์
    overage_ratio = (price - budget) / budget  # เช่น เกิน 50% → 0.5

    # ถ้าเกินงบมากกว่า 100% → คะแนน 0
    if overage_ratio >= 1.0:
        return 0.0

    return 1.0 - overage_ratio

def availability_score(requirement: StudentRequirement, tutor: Tutor) -> float:
    """
    คืนค่า 1.0 ถ้า tutor ว่างครบทุกวันที่นักเรียนต้องการ
    คืนสัดส่วนของวันที่ overlap ถ้าว่างไม่ครบ
    คืนค่า 0.0 ถ้าไม่มีวันที่ตรงกันเลย
    """
    student_days = set(requirement.available_days)
    tutor_days = set(tutor.availability)

    overlap = student_days & tutor_days  # & = intersection (วันที่ตรงกัน)

    if len(student_days) == 0:
        return 0.0

    return len(overlap) / len(student_days)

def rating_score(tutor: Tutor) -> float:
    """
    Normalize rating จาก 0-5 ให้เป็น 0-1
    """
    return tutor.rating / 5.0

def calculate_match_score(requirement: StudentRequirement, tutor: Tutor) -> float:
    """
    คำนวณ Match Score รวมจากทุก component ตามสูตร:
    Score = 0.35×Subject + 0.20×Skill + 0.15×Rating + 0.15×Price + 0.15×Availability
    """
    # --- Subject Match ---
    s_subject = subject_match_score(requirement, tutor)

    # --- Skill Match ---
    skill_order = {"beginner": 0, "intermediate": 1, "advanced": 2}
    req_level = skill_order.get(requirement.skill_level, 0)
    tutor_level = skill_order.get(tutor.skill_level, 0)

    if tutor_level < req_level:
        s_skill = 0.0  # tutor ระดับต่ำกว่า สอนไม่ได้
    elif tutor_level == req_level:
        s_skill = 1.0  # ตรงพอดี
    else:
        gap = tutor_level - req_level
        s_skill = 1.0 / (2 ** gap)  # สูงกว่า 1 ระดับ → 0.5, 2 ระดับ → 0.25

    # --- Rating, Price, Availability ---
    s_rating = rating_score(tutor)
    s_price = price_match_score(requirement, tutor)
    s_avail = availability_score(requirement, tutor)

    # --- รวมตามสูตร ---
    score = (
        0.35 * s_subject +
        0.20 * s_skill   +
        0.15 * s_rating  +
        0.15 * s_price   +
        0.15 * s_avail
    )

    return round(score, 4)

def rank_tutors(requirement: StudentRequirement, tutor_list: list[Tutor]) -> list[dict]:
    """
    คืน top 3 tutors พร้อมคะแนน เรียงจากมากไปน้อย
    รูปแบบที่คืน: [{"rank": 1, "tutor": Tutor, "score": 0.85}, ...]
    """
    # คำนวณ score ทุกคน
    scored = [
        {"tutor": tutor, "score": calculate_match_score(requirement, tutor)}
        for tutor in tutor_list
    ]

    # เรียงจากคะแนนมากไปน้อย
    scored.sort(key=lambda x: x["score"], reverse=True)

    # เพิ่ม rank และคืนแค่ top 3
    top3 = scored[:3]
    for i, item in enumerate(top3):
        item["rank"] = i + 1

    return top3
