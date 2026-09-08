from pydantic import BaseModel, Field
from typing import List, Optional


class Tutor(BaseModel):
    # ── ข้อมูลพื้นฐาน ──────────────────────────────
    id: str
    name: str

    # ── Structured Fields (ใช้กับ Rule-based Scoring) ──
    subjects: List[str]          # เช่น ["Python", "Data Structure"]
    skill_level: str             # "beginner" | "intermediate" | "advanced"
    price_per_hour: float        # หน่วย: บาท
    rating: float                # 0.0 - 5.0
    experience_years: int        # จำนวนปีที่สอน
    availability: List[str]      # เช่น ["Mon", "Wed", "Fri"]

    # ── Unstructured Text (ใช้กับ RAG) ─────────────
    bio: str                     # แนะนำตัวเอง
    teaching_style: str          # วิธีการสอน
    reviews: List[str]           # รีวิวจากนักเรียน

class StudentRequirement(BaseModel):
    # ── สิ่งที่นักเรียนต้องการ ──────────────────────
    subject: str                        # วิชาที่อยากเรียน เช่น "Python"
    skill_level: str                    # ระดับของตัวเอง "beginner" | "intermediate" | "advanced"
    budget_per_hour: float              # งบสูงสุดต่อชั่วโมง (บาท)
    available_days: List[str]           # วันที่ว่าง เช่น ["Mon", "Wed"]

    # ── Optional: ข้อความอิสระสำหรับ RAG ────────────
    description: Optional[str] = None  # เช่น "อยากได้คนที่สอนแบบ hands-on"

