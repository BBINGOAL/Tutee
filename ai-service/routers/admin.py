from fastapi import APIRouter, HTTPException
from database import get_db_connection
from embedder import embed_text

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/sync_vectors")
def sync_vectors():
    """
    ดึงข้อมูลจากตาราง tutors ทั้งหมดมาคำนวณ Vector ใหม่
    และบันทึกลงตาราง tutor_embeddings
    """
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        with conn.cursor() as cur:
            # 1. ลบข้อมูล vector เก่าทิ้งทั้งหมด
            cur.execute("TRUNCATE TABLE tutor_embeddings;")
            
            # 2. ดึงข้อมูล tutor ทั้งหมด
            cur.execute("SELECT * FROM tutors;")
            tutors = cur.fetchall()
            
            count = 0
            # 3. คำนวณและบันทึก Vector ทีละคน
            for tutor in tutors:
                # รวม text แบบเดียวกับที่เคยทำใน mock
                reviews_text = " ".join(tutor['reviews']) if tutor['reviews'] else ""
                bio = tutor['bio'] or ""
                teaching_style = tutor['teaching_style'] or ""
                subjects_text = "Subjects: " + ", ".join(tutor['subjects']) if tutor['subjects'] else ""
                availability_text = "Available on: " + ", ".join(tutor['availability']) if tutor['availability'] else ""
                
                text_to_embed = f"{subjects_text}. {availability_text}. {bio} {teaching_style} {reviews_text}".strip()
                if not text_to_embed:
                    continue # ข้ามถ้าไม่มีข้อมูลให้คำนวณเลย
                
                vector = embed_text(text_to_embed)
                
                # แปลง list เป็น string format สำหรับ pgvector '[1.2, 0.5, ...]'
                vector_str = f"[{','.join(map(str, vector))}]"
                
                cur.execute(
                    "INSERT INTO tutor_embeddings (tutor_id, field_name, embedding) VALUES (%s, %s, %s)",
                    (tutor['id'], 'all', vector_str)
                )
                count += 1
                
            conn.commit()
            return {"status": "success", "synced_tutors": count}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
