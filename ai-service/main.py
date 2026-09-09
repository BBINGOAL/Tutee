from fastapi import FastAPI
from routers import recommend, ask

app = FastAPI(
    title="Tutee AI Service",
    description="ระบบแนะนำติวเตอร์และผู้ช่วย AI ด้วย Rule-based Scoring และ RAG Pipeline",
    version="0.2.0",
)

# รวม router เข้ากับ app หลัก
app.include_router(recommend.router, prefix="/api/v1", tags=["Recommendation"])
app.include_router(ask.router, prefix="/api/v1", tags=["RAG"])


@app.get("/health")
def health_check():
    """ตรวจสอบว่า server ทำงานอยู่"""
    return {"status": "ok", "service": "tutee-ai"}
