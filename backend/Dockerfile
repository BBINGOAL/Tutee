# 1. เลือก Base Image: เริ่มต้นจากคอมพิวเตอร์จำลองที่มี Node.js เวอร์ชั่น 20 ติดตั้งมาให้แล้ว
FROM node:20-slim

# 2. ตั้งค่า Working Directory: ย้ายเข้าไปทำงานในโฟลเดอร์ /app
WORKDIR /app

# 3. ก๊อปปี้ไฟล์ package.json และ package-lock.json เข้ามาก่อน
# (ทำแค่นี้ก่อน เพื่อให้ Docker ดึง Cache มาใช้ได้ ถ้าเราไม่ได้แก้ package.json)
COPY package*.json ./

# 4. สั่งติดตั้ง Libraries ตามที่ระบุไว้
RUN npm install

# 5. ก๊อปปี้ไฟล์โค้ดที่เหลือทั้งหมด (เช่น index.js, โฟลเดอร์ src/) เข้าไป
COPY . .

# 6. เปิด Port 5000 ให้โลกภายนอกเชื่อมต่อเข้ามาได้
EXPOSE 5000

# 7. คำสั่งสุดท้ายที่จะรันเมื่อ Container สตาร์ท
CMD ["node", "index.js"]
