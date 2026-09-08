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
