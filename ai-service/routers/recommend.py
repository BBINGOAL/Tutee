import json
from fastapi import APIRouter
from pathlib import Path
from pydantic import BaseModel
from models import Tutor, StudentRequirement
from scorer import rank_tutors
from explainer import explain_recommendation

router = APIRouter()

# โหลด mock data ครั้งเดียวตอน server เริ่ม
DATA_PATH = Path(__file__).parent.parent / "mock_tutors.json"

with open(DATA_PATH, encoding="utf-8") as f:
    TUTORS = [Tutor(**t) for t in json.load(f)]


class ScoreBreakdown(BaseModel):
    """คะแนนแยกรายด้าน (0.0 - 1.0)"""
    subject_score: float
    skill_score:   float
    rating_score:  float
    price_score:   float
    avail_score:   float


class TutorResponse(BaseModel):
    """Schema ของ tutor แต่ละคนใน response (เพิ่ม breakdown + explanation)"""
    rank:            int
    total_score:     float
    score_breakdown: ScoreBreakdown
    explanation:     str
    id:              str
    name:            str
    subjects:        list[str]
    price_per_hour:  float
    rating:          float
    availability:    list[str]


@router.post("/recommend", response_model=list[TutorResponse])
def recommend_tutors(requirement: StudentRequirement) -> list[TutorResponse]:
    """
    รับ StudentRequirement แล้วคืน top-3 tutors พร้อม:
    - คะแนนรวม (total_score)
    - คะแนนแยกรายด้าน (score_breakdown)
    - คำอธิบายภาษาคนจาก AI (explanation)
    """
    results = rank_tutors(requirement, TUTORS)

    response = []
    for r in results:
        tutor = r["tutor"]

        # เรียก Explainer pipeline (คำนวณ breakdown + สร้างคำอธิบาย)
        explanation, breakdown = explain_recommendation(requirement, tutor)

        response.append(
            TutorResponse(
                rank=r["rank"],
                total_score=r["score"],
                score_breakdown=ScoreBreakdown(**breakdown),
                explanation=explanation,
                id=tutor.id,
                name=tutor.name,
                subjects=tutor.subjects,
                price_per_hour=tutor.price_per_hour,
                rating=tutor.rating,
                availability=tutor.availability,
            )
        )

    return response
