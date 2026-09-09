from sentence_transformers import SentenceTransformer

# โหลด model ครั้งเดียวตอน import
# ครั้งแรกจะ download ~400MB อัตโนมัติ
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
_model = SentenceTransformer(MODEL_NAME)


def embed_text(text: str) -> list[float]:
    """
    แปลงข้อความเป็น vector (embedding)
    คืน list ของ float ขนาด 384 มิติ
    """
    # encode() รับ string หรือ list[string]
    # ถ้าส่ง string เดียว → คืน numpy array 1 มิติ
    vector = _model.encode(text)

    # แปลงจาก numpy array → list[float]
    # เพราะ Python/JSON ทำงานกับ list ได้ดีกว่า numpy
    return vector.tolist()
