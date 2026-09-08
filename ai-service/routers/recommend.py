import json
from fastapi import APIRouter
from pathlib import Path
from pydantic import BaseModel
from models import Tutor, StudentRequirement
from scorer import rank_tutors

router = APIRouter()

# โหลด mock data ครั้งเดียวตอน server เริ่ม
DATA_PATH = Path(__file__).parent.parent / "mock_tutors.json"

with open(DATA_PATH, encoding="utf-8") as f:
    TUTORS = [Tutor(**t) for t in json.load(f)]


class TutorResponse(BaseModel):
    """Schema ของ tutor แต่ละคนใน response"""
    rank: int
    score: float
    id: str
    name: str
    subjects: list[str]
    price_per_hour: float
    rating: float
    availability: list[str]


@router.post("/recommend", response_model=list[TutorResponse])
def recommend_tutors(requirement: StudentRequirement) -> list[TutorResponse]:
    """
    รับ StudentRequirement แล้วคืน top-3 tutors ที่เหมาะสมที่สุด
    """
    results = rank_tutors(requirement, TUTORS)

    return [
        TutorResponse(
            rank=r["rank"],
            score=r["score"],
            id=r["tutor"].id,
            name=r["tutor"].name,
            subjects=r["tutor"].subjects,
            price_per_hour=r["tutor"].price_per_hour,
            rating=r["tutor"].rating,
            availability=r["tutor"].availability,
        )
        for r in results
    ]
