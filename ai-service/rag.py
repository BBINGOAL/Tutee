from models import Tutor
from vector_search import search_similar_tutors


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
