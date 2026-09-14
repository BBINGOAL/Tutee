# 1. เลือก Base Image: เริ่มต้นจากคอมพิวเตอร์จำลองที่มี Python 3.10 ติดตั้งมาให้แล้ว
FROM python:3.10-slim

# 2. ตั้งค่า Working Directory: สร้างโฟลเดอร์ /app ข้างใน Container และย้ายเข้าไปทำงานในนั้น
WORKDIR /app

# 3. ก๊อปปี้ไฟล์ requirements.txt จากเครื่องเรา เข้าไปใน Container ที่ /app
COPY requirements.txt .

# 4. สั่งติดตั้ง Libraries ต่างๆ ตามที่ระบุไว้
RUN pip install --no-cache-dir -r requirements.txt

# 5. ก๊อปปี้ไฟล์โค้ดทั้งหมด (เช่น main.py, scorer.py) เข้าไปใน Container
COPY . .

# 6. เปิด Port 8000 ให้โลกภายนอก (หรือ Container อื่น) สามารถเชื่อมต่อเข้ามาได้
EXPOSE 8000

# 7. คำสั่งสุดท้ายที่จะรันเมื่อ Container สตาร์ท (เหมือนเราพิมพ์ใน Terminal)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
