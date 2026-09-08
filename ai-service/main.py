from fastapi import FastAPI
from routers import recommend

app = FastAPI(
    title="Tutee AI Service",
    description="ระบบแนะนำติวเตอร์ด้วย Rule-based Scoring",
    version="0.1.0",
)

# รวม router เข้ากับ app หลัก
app.include_router(recommend.router, prefix="/api/v1", tags=["Recommendation"])


@app.get("/health")
def health_check():
    """ตรวจสอบว่า server ทำงานอยู่"""
    return {"status": "ok", "service": "tutee-ai"}
