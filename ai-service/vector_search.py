import json
import math
from pathlib import Path
from models import Tutor
from embedder import embed_text


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """
    คำนวณ cosine similarity ระหว่าง 2 vectors
    คืนค่าระหว่าง -1.0 ถึง 1.0 (ยิ่งใกล้ 1 ยิ่งคล้ายกัน)
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a ** 2 for a in vec_a))
    magnitude_b = math.sqrt(sum(b ** 2 for b in vec_b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0.0

    return dot_product / (magnitude_a * magnitude_b)


def build_tutor_text(tutor: Tutor) -> str:
    """
    รวมข้อความ unstructured ของ tutor เป็น string เดียว
    เพื่อนำไป embed เป็น vector
    """
    reviews_text = " ".join(tutor.reviews)
    return f"{tutor.bio} {tutor.teaching_style} {reviews_text}"


def search_similar_tutors(query_text: str, top_k: int = 3) -> list[dict]:
    """
    ค้นหา tutors ที่มีข้อความใกล้เคียงกับ query มากที่สุด
    โดยใช้ cosine similarity บน mock data
    """
    # โหลด tutors
    data_path = Path(__file__).parent / "mock_tutors.json"
    with open(data_path, encoding="utf-8") as f:
        tutors = [Tutor(**t) for t in json.load(f)]

    # embed query
    query_vector = embed_text(query_text)

    # คำนวณ similarity กับทุก tutor
    results = []
    for tutor in tutors:
        tutor_text = build_tutor_text(tutor)
        tutor_vector = embed_text(tutor_text)
        similarity = cosine_similarity(query_vector, tutor_vector)
        results.append({"tutor": tutor, "similarity": round(similarity, 4)})

    # เรียงจาก similarity มากไปน้อย
    results.sort(key=lambda x: x["similarity"], reverse=True)

    return results[:top_k]
