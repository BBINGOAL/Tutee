import json
import math
from models import Tutor
from embedder import embed_text
from database import get_db_connection
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
    โดยใช้ vector cosine similarity บน PostgreSQL (pgvector)
    """
    # embed query
    query_vector = embed_text(query_text)
    vector_str = f"[{','.join(map(str, query_vector))}]"
    
    conn = get_db_connection()
    if not conn:
        return []

    results = []
    try:
        with conn.cursor() as cur:
            # Query หา vector ที่มีระยะทางน้อยที่สุด (คล้ายมากที่สุด)
            cur.execute("""
                SELECT t.*, e.embedding <-> %s::vector AS distance
                FROM tutor_embeddings e
                JOIN tutors t ON t.id = e.tutor_id
                ORDER BY distance ASC
                LIMIT %s;
            """, (vector_str, top_k))
            
            rows = cur.fetchall()
            
            for row in rows:
                # สร้าง Tutor object จาก dict ที่ได้จาก database
                tutor_data = {
                    "id": str(row["id"]), # แปลงกลับเป็น string ให้ตรงกับ model
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
                
                tutor_obj = Tutor(**tutor_data)
                
                # similarity ยิ่งค่า distance น้อย (ใกล้ 0) ยิ่งเหมือน
                # แปลง distance เป็น similarity คร่าวๆ (cosine similarity = 1 - (distance^2)/2) 
                # แต่ pgvector <-> คือ L2 distance สำหรับ ivfflat หรือ cosine distance ขึ้นอยู่กับ type 
                # ถ้าใช้ vector_cosine_ops, <-> คือ cosine distance, similarity = 1 - distance
                similarity = 1.0 - float(row["distance"])
                
                results.append({
                    "tutor": tutor_obj,
                    "similarity": round(similarity, 4)
                })
    except Exception as e:
        print(f"Vector search error: {e}")
    finally:
        conn.close()

    return results
