from fastapi import APIRouter
from pydantic import BaseModel
from models import Tutor
from rag import retrieve_context, generate_answer

router = APIRouter()


class AskRequest(BaseModel):
    """Schema ของข้อมูลที่ส่งเข้ามาถาม"""
    question: str


class AskResponse(BaseModel):
    """Schema ของคำตอบที่ส่งกลับไปให้ Frontend"""
    answer: str
    sources: list[Tutor]


@router.post("/ask", response_model=AskResponse)
def ask_tutor_assistant(request: AskRequest) -> AskResponse:
    """
    RAG Endpoint:
    1. รับคำถามจากผู้ใช้
    2. ทำ Semantic Search ค้นหาติวเตอร์ที่ตรงกับคำถาม (sources)
    3. ส่ง context ให้ Gemini สร้างคำตอบ (answer)
    4. ตอบกลับทั้ง answer และ sources
    """
    # 1. ดึงติวเตอร์ที่เกี่ยวข้อง 3 คน
    sources = retrieve_context(request.question, top_k=3)

    # 2. ส่งให้ LLM สรุปคำตอบ
    answer = generate_answer(request.question, retrieved_tutors=sources)

    # 3. ส่งข้อมูลกลับ
    return AskResponse(answer=answer, sources=sources)
