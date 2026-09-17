import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import Tutor, StudentRequirement
from scorer import rank_tutors
from explainer import explain_recommendation_batch
from database import get_db_connection

router = APIRouter()


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
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    tutors = []
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM tutors;")
            rows = cur.fetchall()
            for row in rows:
                tutor_data = {
                    "id": str(row["id"]),
                    "name": row["name"],
                    "subjects": row["subjects"] or [],
                    "skill_level": row["skill_level"] or "",
                    "price_per_hour": float(row["price_per_hour"] or 0),
                    "rating": float(row["rating"] or 0),
                    "experience_years": row["experience_years"] or 0,
                    "availability": row["availability"] or [],
                    "bio": row["bio"] or "",
                    "teaching_style": row["teaching_style"] or "",
                    "reviews": row["reviews"] or []
                }
                tutors.append(Tutor(**tutor_data))
    except Exception as e:
        print(f"Error fetching tutors for recommendation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

    results = rank_tutors(requirement, tutors)

    # แยกลิสต์ของ tutor เปล่าๆ ออกมาจากผลลัพธ์ของ rank_tutors
    top_tutors = [r["tutor"] for r in results]
    
    # เรียก Batch Pipeline!
    explanations_data = explain_recommendation_batch(requirement, top_tutors)

    response = []
    for i, r in enumerate(results):
        tutor = r["tutor"]
        explanation, breakdown = explanations_data[i]

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
