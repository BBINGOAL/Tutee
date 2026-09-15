from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import recommend, ask

app = FastAPI(
    title="Tutee AI Service",
    description="ระบบแนะนำติวเตอร์และผู้ช่วย AI ด้วย Rule-based Scoring และ RAG Pipeline",
    version="0.2.0",
)

# อนุญาต CORS จาก Frontend (Vite :5173) และ Node.js Gateway (:5000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# รวม router เข้ากับ app หลัก
app.include_router(recommend.router, prefix="/api/v1", tags=["Recommendation"])
app.include_router(ask.router, prefix="/api/v1", tags=["RAG"])


@app.get("/health")
def health_check():
    """ตรวจสอบว่า server ทำงานอยู่"""
    return {"status": "ok", "service": "tutee-ai"}
