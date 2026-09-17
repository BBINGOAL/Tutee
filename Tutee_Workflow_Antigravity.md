# Tutee — Workflow สำหรับทำเองทีละสเต็ปกับ Antigravity

## วิธีใช้เอกสารนี้

1. แต่ละ Phase มี **prompt สำเร็จรูป** ให้คัดลอกไปวางใน Antigravity
2. Antigravity จะอธิบาย + ให้โค้ดทีละส่วน แล้ว **หยุดรอ** ให้คุณพิมพ์ต่อ
3. อย่าข้าม Phase — แต่ละอันต่อยอดจากอันก่อนหน้า
4. ถ้า agent เขียนโค้ดยาวเกินไปในครั้งเดียว ให้พิมพ์กลับไปว่า "หยุดก่อน อธิบายส่วนนี้ให้ผมเข้าใจก่อน แล้วค่อยไปต่อ"

โครงสร้างที่จะได้ตอนจบ:

```
tutee/
├── ai-service/        (FastAPI + RAG + Recommendation)
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── routers/
│   │   └── main.py
│   ├── data/
│   ├── eval/
│   └── requirements.txt
├── backend/           (Node.js/Express — API gateway)
├── frontend/          (React)
└── docker-compose.yml
```

---

## Phase 0 — Project Setup

### เป้าหมาย
ตั้งโครงสร้างโปรเจกต์ + environment โดยไม่รีบเขียน logic ใดๆ

### Prompt สำหรับ Antigravity

```
ฉันกำลังทำโปรเจกต์ชื่อ Tutee — ระบบแนะนำติวเตอร์ด้วย AI
Tech stack: React (frontend), Node.js/Express (backend), Python/FastAPI (AI service),
PostgreSQL + pgvector (database), Docker

ตอนนี้ต้องการแค่ Phase 0: Project Setup เท่านั้น ห้ามเขียนโค้ด logic ใดๆ

กติกาการทำงานร่วมกันของเรา (สำคัญมาก - ต้องทำตามทุก Phase):
1. อธิบายว่าไฟล์/โฟลเดอร์นี้มีไว้ทำอะไร ก่อนสร้างทุกครั้ง
2. ให้ทำทีละไฟล์ ไม่ใช่ generate ทั้งหมดในทีเดียว
3. หลังจากอธิบาย+ให้โค้ด/คำสั่งแต่ละส่วนแล้ว ให้หยุดรอ
   ฉันจะรันเองและพิมพ์ "ต่อ" เมื่อพร้อมไปขั้นถัดไป
4. ห้าม assume ว่าฉันรู้อะไรอยู่แล้ว - อธิบายเหมือนสอนมือใหม่

สิ่งที่ต้องการใน Phase 0:
- โครงสร้างโฟลเดอร์ระดับบนสุด (ai-service, backend, frontend)
- อธิบายว่าทำไมต้องแยก 3 ส่วนนี้ ไม่รวมเป็นอันเดียว
- ตั้ง Python virtual environment สำหรับ ai-service
- requirements.txt เริ่มต้น (fastapi, uvicorn เท่านั้นตอนนี้)
- อธิบายว่า FastAPI คืออะไร ต่างจาก Flask/Django ยังไง ทำไมเลือกตัวนี้

เริ่มอธิบาย Phase 0 ได้เลย ทีละขั้นตอน
```

---

## Phase 1 — Data Model

### เป้าหมาย
ออกแบบ schema ของ Tutor / Student / Requirement ก่อนเขียน logic ใดๆ
นี่คือรากฐานที่ทุกอย่างข้างหน้าจะอ้างอิง

### สิ่งที่คุณควรเข้าใจก่อนเริ่ม
- Feature ของ Tutor ที่ต้องมี: subject, skill_level, price_per_hour, rating, experience_years, availability, reviews
- ต้องคิดว่าข้อมูลไหนใช้กับ **rule-based scoring** (ตัวเลข/category) และข้อมูลไหนใช้กับ **RAG** (ข้อความอิสระ เช่น review, course description)

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 0 ตอนนี้ทำ Phase 1: Data Model

บริบท: ระบบต้องรองรับ 2 อย่างคู่กัน
(a) Rule-based scoring ที่ต้องการ field เป็นตัวเลข/category ชัดเจน
    (subject, skill_level, price, rating, availability)
(b) RAG ที่ต้องการข้อความอิสระ (review, course description, teaching style)
    เพื่อเอาไป embed เป็น vector

งานที่ต้องการ:
1. อธิบายก่อนว่าทำไมต้องแยก structured fields กับ unstructured text
   และทำไมทั้งสองแบบต้องอยู่ใน record เดียวกันของ Tutor
2. ออกแบบ Pydantic model (Python) สำหรับ Tutor คนเดียวก่อน
   - อธิบายว่า Pydantic คืออะไร ทำไมใช้แทน dict ธรรมดา
3. ออกแบบ Pydantic model สำหรับ StudentRequirement
   (สิ่งที่นักเรียนกรอกเข้ามา เช่น subject, budget, available_time, skill_level)
4. สร้างไฟล์ mock data ~10 tutors เป็น JSON เพื่อทดสอบในขั้นถัดไป
   ให้ tutor มีความหลากหลายพอที่จะทดสอบ scoring ได้จริง
   (ราคาต่าง, subject ต่าง, rating ต่าง)

ทำทีละข้อ อธิบายก่อนโค้ดเสมอ แล้วหยุดรอฉันพิมพ์ "ต่อ"
```

---

## Phase 2 — Rule-based Recommendation Engine

### เป้าหมาย
ทำ Match Score ตามสูตรที่วางไว้ **ก่อน** จะไปแตะ AI/LLM ใดๆ
ส่วนนี้คือหัวใจที่ทำให้โปรเจกต์นี้ "เป็น engineering" ไม่ใช่แค่ prompt LLM

### สูตรอ้างอิง
```
Match Score = 0.35 × Subject Match
            + 0.20 × Skill Match
            + 0.15 × Rating
            + 0.15 × Price Match
            + 0.15 × Availability
```

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 1 ตอนนี้ทำ Phase 2: Rule-based Recommendation Engine

สูตรที่ต้องการ:
Match Score = 0.35×SubjectMatch + 0.20×SkillMatch + 0.15×Rating
            + 0.15×PriceMatch + 0.15×Availability

ทุก component ต้อง normalize เป็น 0-1 ก่อนคูณ weight

งานที่ต้องการ (ทำทีละฟังก์ชัน อธิบายก่อนเขียนทุกครั้ง):

1. ก่อนเขียนโค้ด อธิบายว่าทำไมต้อง normalize คะแนนแต่ละ component
   ก่อนรวมกัน (ยกตัวอย่างว่าถ้าไม่ normalize จะเกิดปัญหาอะไร)

2. เขียนฟังก์ชัน subject_match_score(requirement, tutor) -> float
   - อธิบายวิธีคิด: exact match vs partial match ยังไง
     (เช่น นักเรียนอยากเรียน "Data Structure" แต่ tutor สอน "Java, Algorithm, DS")

3. เขียนฟังก์ชัน price_match_score(requirement, tutor) -> float
   - อธิบาย: ราคาต่ำกว่างบ ควรได้คะแนนเท่าไหร่ vs สูงกว่างบเล็กน้อย
     ควรเป็น penalty แบบ linear หรือ step function? อธิบายข้อดีข้อเสีย

4. เขียนฟังก์ชัน availability_score(requirement, tutor) -> float

5. เขียนฟังก์ชัน rating_score(tutor) -> float (แค่ normalize rating 0-5 เป็น 0-1)

6. รวมทุกอย่างเป็นฟังก์ชัน calculate_match_score(requirement, tutor) -> float
   ที่ใช้สูตรข้างบน

7. เขียนฟังก์ชัน rank_tutors(requirement, tutor_list) -> list
   ที่คืน top 3 พร้อมคะแนน โดยเรียงจากมากไปน้อย

ทำทีละข้อ ให้ฉันรันทดสอบกับ mock data จาก Phase 1 ก่อนไปข้อถัดไป
หยุดรอทุกครั้งหลังจบแต่ละข้อ
```

---

## Phase 3 — FastAPI Wrapper

### เป้าหมาย
เอา Recommendation Engine จาก Phase 2 มาเปิดเป็น API endpoint จริง

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 2 ตอนนี้ทำ Phase 3: FastAPI Wrapper

งานที่ต้องการ:
1. อธิบายโครงสร้างพื้นฐานของ FastAPI app (main.py, routers, dependency injection)
   ทำไมไม่ใส่ logic ทั้งหมดใน main.py ไฟล์เดียว

2. สร้าง POST endpoint /recommend
   - Request body: StudentRequirement (จาก Phase 1)
   - Response: list ของ top-3 tutors พร้อม match score
   - อธิบาย request/response schema ด้วย Pydantic

3. อธิบายวิธีทดสอบผ่าน FastAPI's auto docs (/docs หรือ Swagger UI)
   ให้ฉันลองยิง request เองผ่านหน้านั้นก่อน

4. อธิบาย error handling เบื้องต้น เช่น ถ้า requirement ไม่มี subject
   ควร return error อะไร (400? 422?) และทำไม

ทำทีละข้อ หยุดรอฉันทดสอบก่อนไปข้อถัดไป
```

---

## Phase 4 — Embedding + Vector Search (pgvector)

### เป้าหมาย
เริ่มส่วน RAG จริงจัง — ทำความเข้าใจ embedding และ vector search ก่อนต่อ LLM

### สิ่งที่ควรรู้ก่อนเข้า phase นี้
Embedding คือการแปลงข้อความเป็นตัวเลข (vector) ที่ข้อความความหมายใกล้กันจะอยู่ใกล้กันในปริภูมิเวกเตอร์ — นี่คือกลไกที่ทำให้ "ค้นหาด้วยความหมาย" ต่างจากค้นหาด้วย keyword ธรรมดา

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 3 ตอนนี้ทำ Phase 4: Embedding + Vector Search

งานที่ต้องการ:
1. อธิบาย embedding คืออะไรแบบละเอียดแต่เข้าใจง่าย
   - ทำไมข้อความ "ไม่เข้าใจ AVL Tree" กับ "งง balanced tree"
     ควรมี vector ใกล้กัน
   - เปรียบเทียบ semantic search vs keyword search (ยกตัวอย่างจริง)

2. เลือก embedding model ให้ (เช่น จาก OpenAI/Anthropic/sentence-transformers)
   อธิบายข้อดีข้อเสียของแต่ละตัวเลือกสำหรับโปรเจกต์นี้
   (ค่าใช้จ่าย, ความเร็ว, ต้อง host เองหรือไม่)

3. เขียนฟังก์ชัน embed_text(text: str) -> list[float]
   อธิบายทีละบรรทัดว่า API call ทำอะไรบ้าง

4. อธิบาย pgvector คืออะไร ต่างจาก PostgreSQL ธรรมดายังไง
   ทำไมไม่ใช้ vector DB แยกเช่น Pinecone/Weaviate

5. เขียน SQL schema สำหรับตาราง tutor_embeddings
   ที่เก็บ tutor_id + vector column
   อธิบายว่าทำไมต้องแยกตารางนี้จากตาราง tutor หลัก

6. เขียนฟังก์ชัน search_similar_tutors(query_vector, top_k) -> list
   ที่ใช้ cosine similarity ผ่าน pgvector
   อธิบาย cosine similarity คืออะไร ทำไมนิยมใช้กับ embedding มากกว่า euclidean distance

ทำทีละข้อ อธิบายละเอียด เพราะส่วนนี้เป็นของใหม่สำหรับฉัน
หยุดรอทุกครั้ง
```

---

## Phase 5 — RAG Pipeline

### เป้าหมาย
เชื่อม retrieval (Phase 4) เข้ากับ LLM เพื่อตอบคำถามแบบมี context

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 4 ตอนนี้ทำ Phase 5: RAG Pipeline

Flow ที่ต้องการ:
User Question → Embedding → Vector Search → Relevant Tutor Data → LLM → Answer

งานที่ต้องการ:
1. อธิบาย RAG คืออะไร แก้ปัญหาอะไรของ LLM เปล่าๆ
   (hallucination, ข้อมูลไม่อัพเดท, ไม่รู้ context เฉพาะของระบบเรา)

2. เขียนฟังก์ชัน retrieve_context(question: str, top_k: int) -> list[Tutor]
   ที่รวม embed_text + search_similar_tutors จาก Phase 4

3. อธิบาย prompt engineering สำหรับ RAG:
   - ทำไมต้องบอก LLM ชัดๆ ว่า "ตอบจากข้อมูลที่ให้เท่านั้น"
   - ทำไมต้องใส่ system prompt แยกจาก user question
   - ยกตัวอย่าง prompt template ที่ดีและไม่ดี

4. เขียนฟังก์ชัน build_rag_prompt(question, retrieved_tutors) -> str
   ที่ประกอบ context + question เป็น prompt เดียว

5. เขียนฟังก์ชัน generate_answer(prompt) -> str ที่เรียก LLM API
   อธิบาย parameter สำคัญ เช่น temperature ควรตั้งเท่าไหร่สำหรับงานนี้ ทำไม

6. รวมทุกอย่างเป็น endpoint POST /ask ใน FastAPI

ทำทีละข้อ หยุดรอทุกครั้งก่อนไปข้อถัดไป
```

---

## Phase 6 — Explainable Recommendation

### เป้าหมาย
ทำให้ทั้ง 2 ระบบ (rule-based + RAG) อธิบายเหตุผลได้ ไม่ใช่แค่ให้คำตอบเฉยๆ

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 5 ตอนนี้ทำ Phase 6: Explainable Recommendation

เป้าหมาย: แทนที่จะตอบแค่ "แนะนำ Tutor A"
ต้องตอบแบบ "แนะนำ Tutor A เพราะ [เหตุผลอิงจาก match score จริง]"

งานที่ต้องการ:
1. อธิบายความแตกต่างระหว่าง 2 แนวทาง:
   (a) ให้ LLM สร้างคำอธิบายจาก match score ที่คำนวณไว้แล้ว (Phase 2)
   (b) ให้ LLM ตัดสินใจเองทั้งหมด
   อธิบายว่าทำไมแนวทาง (a) เชื่อถือได้กว่าและตรวจสอบย้อนกลับได้ (auditable)

2. เขียนฟังก์ชัน build_explanation_prompt(requirement, tutor, score_breakdown) -> str
   ที่ส่ง score breakdown (subject_score, price_score, ฯลฯ) ให้ LLM
   แล้วให้ LLM แค่ "เรียบเรียงเป็นภาษาคน" ไม่ใช่คิดคะแนนเอง

3. เขียนฟังก์ชัน explain_recommendation(requirement, tutor) -> str
   ที่รวม calculate_match_score (Phase 2) + build_explanation_prompt + LLM call

4. อัพเดท endpoint /recommend ให้ return คำอธิบายพร้อมคะแนนแยกเป็น breakdown ด้วย
   ไม่ใช่แค่ total score

ทำทีละข้อ หยุดรอทุกครั้ง
```

---

## Phase 7 — Evaluation Framework (Recommendation)

### เป้าหมาย
วัดผลว่าระบบแนะนำแม่นแค่ไหน — ส่วนนี้สำคัญที่สุดสำหรับการเอาไปคุยตอนสัมภาษณ์งาน

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 6 ตอนนี้ทำ Phase 7: Evaluation Framework

งานที่ต้องการ:
1. อธิบาย metric แต่ละตัวก่อนเขียนโค้ด:
   - Top-1 Accuracy คืออะไร วัดยังไง
   - Top-3 Accuracy ต่างจาก Top-1 ยังไง ทำไมสำคัญสำหรับ recommendation system
   - Precision และ Recall ในบริบทนี้หมายถึงอะไร
     (ยกตัวอย่างที่ระบบแนะนำถูกบางส่วน)
   - Response Latency วัดยังไง ทำไมสำคัญ

2. ช่วยออกแบบ test dataset ~20-30 คู่
   (question/requirement → expected tutor)
   อธิบายว่าควรออกแบบ test case ให้ครอบคลุมกรณีไหนบ้าง
   (เช่น กรณีชัดเจน, กรณีคลุมเครือ, กรณี edge case ที่ไม่มี tutor ตรงเป๊ะ)

3. เขียนฟังก์ชัน evaluate_top_k(test_dataset, k) -> float

4. เขียนฟังก์ชัน evaluate_latency(test_dataset) -> dict
   (mean, p50, p95)

5. เขียน script ที่รัน evaluation ทั้งหมดแล้ว print เป็นตารางสรุป

ทำทีละข้อ อธิบายก่อนเขียนโค้ดเสมอ หยุดรอทุกครั้ง
```

---

## Phase 8 — RAG Evaluation

### เป้าหมาย
วัดคุณภาพของ RAG แยกจาก recommendation engine

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 7 ตอนนี้ทำ Phase 8: RAG Evaluation

งานที่ต้องการ:
1. อธิบาย 3 metric นี้ก่อนเขียนโค้ด:
   - Retrieval Accuracy: วัดว่า vector search ดึง tutor ที่ถูกต้องมาหรือไม่
   - Answer Relevance: วัดว่าคำตอบของ LLM ตรงกับคำถามหรือไม่
   - Groundedness: วัดว่าคำตอบอิงจาก context ที่ retrieve มาจริง
     ไม่ได้ hallucinate ขึ้นมาเอง

2. อธิบายวิธีวัด groundedness แบบที่ทำได้จริงในโปรเจกต์ระดับนี้
   (เช่น ใช้ LLM อีกตัวเป็น judge เทียบคำตอบกับ context)

3. เขียนฟังก์ชัน evaluate_retrieval_accuracy(test_cases) -> float

4. เขียนฟังก์ชัน evaluate_groundedness(question, context, answer) -> float
   โดยใช้ LLM-as-judge อธิบาย prompt ที่ใช้ให้ judge ชัดเจน

5. รวมเป็น evaluation report เดียวกับ Phase 7

ทำทีละข้อ หยุดรอทุกครั้ง
```

---

## Phase 9 — Node.js Backend (API Gateway)

### เป้าหมาย
เชื่อม React ↔ FastAPI ผ่าน Node.js layer

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 8 ตอนนี้ทำ Phase 9: Node.js Backend

งานที่ต้องการ:
1. อธิบายว่าทำไมต้องมี Node.js คั่นกลางระหว่าง React กับ FastAPI
   แทนที่จะให้ React เรียก FastAPI ตรงๆ
   (auth, rate limiting, business logic ที่ไม่เกี่ยวกับ AI, ฯลฯ)

2. Setup Express server พื้นฐาน อธิบายโครงสร้าง routes/controllers/services

3. เขียน proxy endpoint POST /api/recommend
   ที่รับ request จาก React แล้ว forward ไป FastAPI /recommend
   อธิบายการจัดการ error ถ้า FastAPI ไม่ตอบ

4. อธิบายพื้นฐาน environment variables (.env) สำหรับเก็บ URL ของ AI service

ทำทีละข้อ หยุดรอทุกครั้ง
```

---

## Phase 10 — Docker + Deployment พื้นฐาน

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 9 ตอนนี้ทำ Phase 10: Docker

งานที่ต้องการ:
1. อธิบาย Docker คืออะไร แก้ปัญหาอะไร (works on my machine problem)
2. เขียน Dockerfile สำหรับ ai-service (Python/FastAPI) พร้อมอธิบายทีละบรรทัด
3. เขียน Dockerfile สำหรับ backend (Node.js) พร้อมอธิบายทีละบรรทัด
4. เขียน docker-compose.yml ที่รวม ai-service + backend + postgres
   อธิบาย networking ระหว่าง container
5. อธิบายขั้นตอนถัดไปคร่าวๆ ถ้าจะ deploy ขึ้น AWS (ไม่ต้องทำจริงตอนนี้)

ทำทีละข้อ หยุดรอทุกครั้ง
```

---

## Timeline แนะนำ (ถึงกลางตุลาคม)

| สัปดาห์ | Phase | โฟกัส |
|---|---|---|
| 1 | 0-1 | Setup + Data Model |
| 2 | 2-3 | Rule-based Engine + API |
| 3 | 4-5 | Embedding + RAG |
| 4 | 6-7 | Explainability + Evaluation |
| 5 | 8-9 | RAG Eval + Backend |
| 6 | 10 + polish | Docker + เตรียม present |

## Future Work (ไม่ทำใน 10 Phase นี้)

10 Phase ข้างบนคือ **AI core** ของระบบเท่านั้น (recommendation + RAG + evaluation)
ยังไม่มี user account, authentication, หรือ admin panel — ทุกอย่างทดสอบผ่าน
Swagger UI (`/docs`) หรือ curl/Postman โดยไม่ต้อง login

ส่วนที่เก็บไว้ทำทีหลัง (หลังมี frontend และ AI core เสถียรแล้ว):

| ส่วน | รายละเอียด |
|---|---|
| User authentication | นักเรียน/ติวเตอร์ สมัครสมาชิก, login, JWT/session |
| User roles | Student vs Tutor vs Admin แยก permission |
| Tutor management | ติวเตอร์ CRUD โปรไฟล์ตัวเอง แทน mock JSON ใน Phase 1 |
| Booking system | จองคิว, ยืนยัน, ปฏิทิน, การชำระเงิน |
| Admin panel | อนุมัติ tutor ใหม่, ดู analytics, จัดการ dispute |
| Review system | นักเรียนให้ rating/review จริงหลังเรียนจบ |

เหตุผลที่ตัดออก: เป้าหมายหลักของโปรเจกต์นี้คือฝึกสาย AI Engineer
(Recommendation System + RAG + Evaluation) ถ้าใส่ auth/admin/booking
เข้าไปด้วยตั้งแต่แรก effort ส่วนใหญ่จะไปอยู่ที่ CRUD/user management
แทนที่จะเป็น AI ซึ่งเสี่ยงทำไม่ทันตาม timeline ที่วางไว้

ตอนเขียน README ให้ใส่หัวข้อนี้ไว้เป็น "Future Improvements" เพื่อโชว์ว่า
คุณเห็นภาพรวมทั้งระบบ ไม่ใช่แค่ทำเท่าที่ทำได้แล้วจบ

---

## Phase 11 — React Frontend (ไม่มี Auth)

### เป้าหมาย
ต่อ UI จริงเข้ากับ API ที่มีอยู่แล้ว (Phase 3 /recommend, Phase 5 /ask)
ไม่มี login/register ในเฟสนี้ — ทุกคนเข้าใช้งานได้เลยเหมือน public tool

ใช้ **Tailwind CSS** เป็น styling framework หลัก (utility-first, responsive
breakpoint ในตัว เช่น `sm: md: lg:` ทำให้ทำ responsive ได้ง่ายและสอดคล้องกับ
ที่ต้องรองรับ 3 breakpoint อยู่แล้ว)

ดีไซน์อ้างอิงจากไฟล์ Figma ที่ทำไว้แล้ว (5 หน้า) — ให้แนบ screenshot
ทั้ง 5 ภาพให้ Antigravity ดูประกอบตอนเริ่ม Phase นี้ด้วย

### Design Spec (จากไฟล์ Figma จริง)

**สีหลัก**
- พื้นหลัง: ครีมอุ่น `#FAF3EA` (โทน oatmeal)
- Surface/การ์ด: ขาว `#FFFFFF` หรือครีมอ่อนกว่าพื้นหลัง
- Accent หลัก: แดงอิฐ `#C0392B` — ใช้กับปุ่ม CTA, highlight, match score, tag badge
- ข้อความหลัก: เกือบดำ `#1F1F1F`
- ข้อความรอง: เทาเข้ม
- เส้นขอบ: บาง 1px สีเทาอ่อน ไม่มี shadow

**ฟอนต์**
- หัวข้อใหญ่ (hero, ชื่อ tutor): serif มีคาแรกเตอร์ (เช่น Fraunces/Lora) ตัว "tutor" ใน headline ใช้ italic serif
- เนื้อหา/UI: sans-serif เรียบง่าย

**5 หน้าที่ต้องสร้าง**

1. **Landing page** — header (โลโก้ Tutee + badge "AI Powered", nav, ปุ่ม "เริ่มใช้งาน"),
   hero section พร้อม 2 ปุ่ม CTA, การ์ด 3 ใบอธิบายจุดเด่น (แนะนำตรงใจ/อธิบายเหตุผลได้/ถามได้แบบแชท),
   section "3 ขั้นตอนง่ายๆ" แบบเลขข้อ 01-02-03, section tutor แนะนำ (การ์ดแนวนอน 3 ใบ),
   CTA section ปิดท้ายพื้นเข้มกว่า, footer

2. **Requirement Form** — การ์ดเดี่ยวกลางจอ ขอบมน มี field: วิชาที่อยากเรียน (text),
   ระดับผู้เรียน (dropdown), งบประมาณต่อชั่วโมง (number + หน่วย "บาท/ชม."),
   วันและเวลาที่สะดวกเรียน (dropdown) ปุ่ม submit สีแดงเต็มความกว้าง
   ข้อความเล็กใต้การ์ดบอกเรื่อง privacy

3. **Tutor Results** — หัวข้อ "ANALYSIS COMPLETE" ตัวเล็กสีแดง, การ์ด tutor เรียงแนวตั้ง
   อันดับ 1 มีเส้นขอบแดงหนาเน้น, แต่ละการ์ดมี badge อันดับ, รูปโปรไฟล์วงกลม,
   เปอร์เซ็นต์ match พร้อม underline สีแดงใต้ตัวเลข, แถว icon (วิชา/ราคา/rating/วันว่าง),
   ส่วน "AI MATCH ANALYSIS" อธิบายเหตุผล, ปุ่ม "ดูโปรไฟล์" ขอบแดงพื้นโปร่ง,
   การ์ด CTA ท้ายหน้าให้ปรับเงื่อนไขแล้ววิเคราะห์ใหม่

4. **Tutee Chat** — header มี back arrow + ชื่อ "ถาม Tutee" + สถานะออนไลน์,
   bubble ฝั่ง AI สีขาวชิดซ้าย, bubble ฝั่งผู้ใช้สีแดงชิดขวา,
   AI ตอบพร้อมแนบการ์ด tutor เล็กๆ (รูป, ชื่อ, rating, tag วิชา, ราคา, ปุ่มดูโปรไฟล์)
   input bar ล่างสุดพร้อมปุ่มส่งวงกลมสีแดง

5. **Tutor Profile** — header + ปุ่มหัวใจ (favorite), รูปโปรไฟล์ใหญ่กลมมีขอบแดง,
   ชื่อ + วุฒิการศึกษา, tag วิชาที่สอนแบบ pill ขอบแดง, แถบสรุป 3 ช่อง
   (ราคา/rating/ประสบการณ์) คั่นเส้นแบ่ง, section "เกี่ยวกับสไตล์การสอน",
   section รีวิวจากนักเรียน (การ์ดย่อย 3 ใบ), ปุ่ม CTA sticky ด้านล่าง "ติดต่อ tutor คนนี้"

### Responsive requirement (สำคัญ — ใส่ไว้ในทุกหน้า)

ใช้ Tailwind breakpoint มาตรฐานตรงๆ ไม่ต้องเขียน custom media query เอง:
- Mobile: default (ไม่ใส่ prefix) — ดูตัวอย่างจาก mockup หน้า Chat และ Profile
  ที่ออกแบบเป็น mobile ไว้แล้ว
- Tablet: `md:` (768px ขึ้นไป)
- Desktop: `lg:` (1024px ขึ้นไป) — ดูตัวอย่างจาก mockup หน้า Landing, Form,
  Results ที่ออกแบบเป็น desktop ไว้แล้ว

กติกาการปรับ layout ตาม breakpoint:
- Landing: การ์ด 3 ใบ (จุดเด่น/tutor แนะนำ) ใช้ `grid grid-cols-1 md:grid-cols-3`
- Form: การ์ดกว้างเต็มจอ (มี padding) บน mobile แทนการ์ดลอยกลางจอแบบ desktop
  เช่น `max-w-full md:max-w-lg mx-auto`
- Results: การ์ด tutor ปรับจาก row เป็น stack ด้วย `flex flex-col lg:flex-row`
- Chat และ Profile: ออกแบบมาเป็น mobile-first อยู่แล้ว ให้ขยายกว้างขึ้นแบบมี
  `max-w-2xl mx-auto` บน desktop แทนที่จะยืดเต็มจอกว้างเกินไป

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 10 ตอนนี้ทำ Phase 11: React Frontend (ยังไม่มี auth)
[แนบ screenshot ทั้ง 5 หน้าจาก Figma ที่ทำไว้]

บริบท: มี Node.js backend (Phase 9) ที่ proxy ไปยัง FastAPI แล้ว
(POST /api/recommend, POST /api/ask)

Tech: ใช้ Tailwind CSS เป็น styling framework หลัก

Design spec: ดูจาก screenshot ที่แนบมา
- สีพื้นหลังครีม #FAF3EA, accent แดง #C0392B, การ์ดขาว/ครีมอ่อน ไม่มี shadow
  เส้นขอบบาง 1px, หัวข้อใหญ่ใช้ font serif (Fraunces หรือ Lora)
- ต้องทำ responsive ด้วย Tailwind breakpoint มาตรฐาน: default (mobile),
  md: (tablet 768px+), lg: (desktop 1024px+) ทุกหน้า

งานที่ต้องการ (ทำทีละหน้า อธิบายก่อนเขียนโค้ดทุกครั้ง):

1. อธิบายวิธี setup React + Tailwind CSS ตั้งแต่ต้น
   (install, tailwind.config, ไฟล์ CSS หลักที่ import directive)
   อธิบาย utility-first คืออะไร ต่างจากการเขียน CSS แยกไฟล์แบบเดิมยังไง
   ทำไมเหมาะกับการทำ responsive เร็วๆ

2. อธิบายวิธีตั้ง custom theme ใน tailwind.config
   (ใส่สีครีม #FAF3EA และแดง #C0392B เป็น custom color name เช่น
   'cream' และ 'brand-red' จะได้เรียกใช้ซ้ำได้ทุกหน้าแบบ bg-cream, text-brand-red
   แทนการพิมพ์ hex code ซ้ำๆ)
   อธิบายวิธีเพิ่ม custom font family (serif) ใน config ด้วย

3. สร้าง Landing page component ด้วย Tailwind classes ตาม design spec
   - อธิบายการใช้ grid grid-cols-1 md:grid-cols-3 ทำการ์ด 3 ใบ responsive
   - อธิบาย breakpoint prefix (md:, lg:) ทำงานยังไง

4. สร้าง RequirementForm component
   - ฟอร์มตาม design spec (4 field + ปุ่ม submit) ด้วย Tailwind
   - อธิบาย controlled component และ useState
   - responsive: max-w-full md:max-w-lg mx-auto

5. สร้าง TutorResults component
   - แสดง top-3 tutor พร้อม match score, underline, AI match analysis
   - อธิบายการจัดการ loading/error state ตอนรอ API ตอบ
   - responsive: flex flex-col lg:flex-row สำหรับการ์ดแต่ละใบ

6. เชื่อม RequirementForm เข้ากับ Node backend (POST /api/recommend)
   อธิบายการจัดการ CORS ถ้าเจอปัญหา

7. สร้าง TuteeChat component ตาม design spec (bubble, การ์ด tutor แนบในแชท)
   เชื่อมกับ POST /api/ask, responsive: max-w-2xl mx-auto บน desktop

8. สร้าง TutorProfile component ตาม design spec (header, tag, สรุป 3 ช่อง, 
   รีวิว, CTA sticky ด้านล่าง)

9. ทำ routing ระหว่างหน้าทั้ง 5 หน้า (react-router หรือเทียบเท่า)
   อธิบายการส่ง state ระหว่างหน้า (เช่น ผลจากฟอร์มส่งต่อไปหน้า results ยังไง)

10. ทดสอบ responsive จริงในเบราว์เซอร์ (resize หรือ dev tools mobile view)
    ทุกหน้าก่อนถือว่าจบ Phase

ทำทีละข้อ หยุดรอฉันทดสอบก่อนไปข้อถัดไป
```

### เช็คก่อนจบ Phase นี้
- กรอกฟอร์มจริงแล้วเห็นผล tutor ที่มาจาก backend จริง (ไม่ใช่ mock data ในหน้าเว็บ)
- ถามคำถามในหน้า chat แล้วได้คำตอบจาก RAG จริง
- ทดสอบ error case (เช่น backend ปิดอยู่) ว่า UI แสดง error ที่เข้าใจได้ ไม่ใช่หน้าขาว
- ย่อ-ขยายหน้าต่างเบราว์เซอร์ทุกหน้า เช็คว่า layout ไม่พัง ทั้ง mobile/tablet/desktop
- เทียบกับ screenshot ต้นฉบับว่าหน้าตาใกล้เคียงกันในทุกขนาดจอ

---

## Phase 12 — Auth + Admin พื้นฐาน (Optional — ทำถ้ามีเวลาเหลือเท่านั้น)

⚠️ **อย่าเริ่ม Phase นี้ถ้าใกล้ deadline แล้ว** ให้ทำ Phase 11 ให้เสถียรก่อน
ถ้าเวลาตึง ให้ข้าม Phase นี้ไปเลยและใช้ระบบแบบ Phase 11 (ไม่มี login) ไปโชว์แทน
ยังคงเป็นชิ้นงานที่สมบูรณ์และน่าประทับใจอยู่

### Scope ที่ตัดให้เบาที่สุดแล้ว
- Register/login ธรรมดา (email + password, JWT)
- 2 role เท่านั้น: student, admin (ไม่มี role tutor แยก)
- Admin ทำได้แค่: ดู list ของ requirement ที่มีคนค้นหา + ดู list user
- **ไม่มี** tutor self-service profile, ไม่มี booking, ไม่มี dashboard analytics

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 11 ตอนนี้ทำ Phase 12: Auth + Admin พื้นฐาน (scope เล็กที่สุด)

Scope ที่ต้องการเท่านั้น (ห้ามเกินนี้):
- Register/login ด้วย email+password, ใช้ JWT
- 2 role: student (default), admin
- Admin page: ดู list user ทั้งหมด, ดู list requirement/search history
- ไม่มี tutor profile management, ไม่มี booking, ไม่มี dashboard กราฟ

งานที่ต้องการ (ทำทีละส่วน):

1. อธิบาย JWT คืออะไร ทำงานยังไง (ต่างจาก session-based auth ยังไง)
   ทำไมเหมาะกับ architecture ที่มี frontend/backend แยกกัน

2. เขียน User model (Node.js/Express + PostgreSQL)
   fields: id, email, password_hash, role, created_at
   อธิบายทำไมต้อง hash password ด้วย bcrypt ไม่เก็บ plain text

3. เขียน POST /api/auth/register และ POST /api/auth/login endpoints
   อธิบาย flow การ validate + hash + generate token ทีละขั้น

4. เขียน middleware ตรวจสอบ JWT สำหรับ protected routes
   อธิบาย middleware pattern คืออะไร

5. อธิบายว่า /api/recommend และ /api/ask ควร require login ไหม
   (แนะนำ: ให้ใช้ได้แบบไม่ต้อง login เหมือนเดิม แต่ถ้า login แล้วเก็บ
   search history ผูกกับ user_id ได้ - หรือจะข้ามส่วนนี้ไปเลยก็ได้ถ้าเวลาน้อย)

6. หน้า Login/Register ใน React (form + เก็บ token ใน memory/localStorage)
   อธิบายความเสี่ยงของการเก็บ JWT ใน localStorage แบบสั้นๆ

7. สร้าง Admin page แสดง user list (ดึงจาก GET /api/admin/users
   ที่ require role=admin เท่านั้น)

ทำทีละข้อ หยุดรอทุกครั้ง ถ้าฉันบอกว่าเวลาไม่พอ ให้สรุปว่าทำถึงไหนแล้ว
พอใช้โชว์ได้ในสภาพที่เป็นอยู่
```

### แผนสำรองถ้าเวลาไม่พอ
ทำแค่ข้อ 1-4 (register/login backend ทำงานได้ ทดสอบผ่าน Postman)
แล้วพูดใน README/สัมภาษณ์ว่า "ออกแบบ auth flow ไว้แล้ว backend ทำงานได้
ส่วน UI login และ admin panel อยู่ระหว่างพัฒนา" — ยังคงน่าเชื่อถือกว่า
การไม่มีอะไรเลย

---

## Phase 13 — Tutor Role (Optional ขั้นสุดท้าย — ทำก็ต่อเมื่อ Phase 12 เสร็จสมบูรณ์แล้วเท่านั้น)

⚠️ **ห้ามเริ่ม Phase นี้ถ้า Phase 12 ยังไม่เสร็จ หรือใกล้ deadline แล้ว**
Phase นี้เปลี่ยนระบบจาก "ใช้ mock tutor data" เป็น "tutor จริงสมัคร/แก้ไข
โปรไฟล์เอง" ซึ่งกระทบทั้ง recommendation engine (Phase 2), RAG (Phase 4-5)
และ evaluation (Phase 7-8) ที่ทำมาทั้งหมด เพราะข้อมูลจะไม่ใช่ static JSON อีกต่อไป

### เหตุผลที่แยกออกมาต่างหาก
การเพิ่ม role "tutor" ไม่ใช่แค่เพิ่ม dropdown ในระบบ login แต่หมายถึง:
- ต้องมีหน้าให้ tutor กรอก/แก้ไขโปรไฟล์ตัวเอง (subject, price, availability)
- ข้อมูลที่ tutor แก้ต้องเก็บใน database จริง เลิกพึ่ง mock JSON จาก Phase 1
- ทุกครั้งที่ tutor แก้โปรไฟล์ ต้อง re-generate embedding ใหม่ (เชื่อมกับ Phase 4)
- Admin ต้องมีหน้า "อนุมัติ tutor ใหม่" ก่อนขึ้นแสดงในระบบจริง

### Scope ที่แนะนำ (เบาที่สุดเท่าที่จะทำได้)
- Tutor register/login (ใช้ auth system เดิมจาก Phase 12 เพิ่ม role "tutor")
- หน้า tutor profile form: กรอก subject, price, availability, คำอธิบายตัวเอง
- เมื่อ tutor บันทึกโปรไฟล์ → เขียนลง PostgreSQL จริง (แทน mock JSON)
- Trigger re-embed ข้อความโปรไฟล์ใหม่ (เรียกฟังก์ชัน embed_text จาก Phase 4 ซ้ำ)
- Admin เห็น list tutor ที่รอ approve → กดอนุมัติ/ปฏิเสธได้
- **ไม่ทำ**: ระบบ verify ตัวตน, การจ่ายเงิน, booking calendar, notification

### Prompt สำหรับ Antigravity

```
ต่อจาก Phase 12 ตอนนี้ทำ Phase 13: Tutor Role (scope เล็กที่สุด)

บริบทสำคัญ: ระบบตอนนี้ยังใช้ mock tutor data (JSON) จาก Phase 1 อยู่
Phase นี้จะเปลี่ยนให้ tutor คนจริงสมัครและกรอกโปรไฟล์เอง แล้วเก็บลง
PostgreSQL แทน พร้อม re-generate embedding ใหม่ทุกครั้งที่แก้ไข

Scope ที่ต้องการเท่านั้น (ห้ามเกินนี้):
- เพิ่ม role "tutor" เข้าไปในระบบ auth เดิม (จาก Phase 12)
- หน้าฟอร์มให้ tutor กรอก/แก้ไขโปรไฟล์: subject, price, availability,
  คำอธิบายสไตล์การสอน
- Backend endpoint บันทึกโปรไฟล์ tutor ลง PostgreSQL จริง
- Trigger เรียก embed_text (จาก Phase 4) ใหม่ทุกครั้งที่ tutor บันทึกโปรไฟล์
- Admin page: list tutor ที่ status = "pending approval" พร้อมปุ่ม approve/reject
- Tutor ที่ยังไม่ approve จะไม่ถูกดึงมาแสดงใน /recommend หรือ /ask

งานที่ต้องการ (ทำทีละส่วน):

1. อธิบายว่าทำไมการเปลี่ยนจาก mock data เป็น dynamic data กระทบ
   recommendation engine และ RAG pipeline ที่ทำมาก่อนหน้านี้ยังไงบ้าง
   (เช่น ต้องมี status field กัน tutor ที่ยังไม่ approve หลุดเข้าไปในผลลัพธ์)

2. ออกแบบ Tutor table ใน PostgreSQL ใหม่ (เพิ่ม field: user_id ผูกกับ
   ตาราง users, status: pending/approved/rejected)
   อธิบาย foreign key relationship ระหว่าง users กับ tutors

3. เขียน POST /api/tutor/profile (สร้าง/แก้ไขโปรไฟล์ตัวเอง)
   require role=tutor เท่านั้น (ใช้ middleware จาก Phase 12)

4. เขียน trigger/logic ที่เรียก embed_text ใหม่ทุกครั้งหลังบันทึกโปรไฟล์
   อธิบายว่าทำไมต้องทำ synchronous หรือ async ตรงนี้ ข้อดีข้อเสียของแต่ละแบบ

5. อัปเดต query ใน /recommend และ /ask ให้ filter เฉพาะ tutor ที่
   status = "approved" เท่านั้น

6. เขียน GET /api/admin/tutors/pending และ POST /api/admin/tutors/:id/approve
   (require role=admin)

7. หน้า React: TutorProfileForm (สำหรับ tutor กรอกข้อมูล) และ
   AdminTutorApproval (list + ปุ่ม approve/reject) ใช้ Tailwind ตาม
   theme เดิมจาก Phase 11

ทำทีละข้อ หยุดรอทุกครั้ง ถ้าฉันบอกว่าเวลาไม่พอ ให้สรุปว่าทำถึงไหนแล้ว
พอใช้โชว์ได้ในสภาพที่เป็นอยู่
```

### แผนสำรองถ้าเวลาไม่พอ
ทำแค่ backend (ข้อ 1-6) ให้ทำงานได้ ทดสอบผ่าน Postman/Swagger พอ
ไม่ต้องทำ React form ให้จบ แล้วพูดใน README ว่า "ออกแบบ tutor onboarding
pipeline ไว้แล้ว รวมถึงการเชื่อมกับ RAG re-embedding เพื่อให้ข้อมูล tutor
ใหม่ค้นหาได้ทันที ส่วน UI ยังอยู่ระหว่างพัฒนา"

---

## Timeline ปรับปรุง (รวม Phase 11-13)

| ช่วง | Phase | หมายเหตุ |
|---|---|---|
| ตอนนี้ - จบ Phase 10 | 0-10 | AI core (ตามแผนเดิม) |
| หลังจบ 10 | 11 | Frontend เปล่า (ไม่มี auth) — **ทำให้เสร็จก่อนเสมอ** |
| ถ้ามีเวลาเหลือ | 12 | Auth + Admin พื้นฐาน (student+admin เท่านั้น) — optional |
| ถ้ามีเวลาเหลือมากจริงๆ | 13 | Tutor role + onboarding — optional ขั้นสุดท้าย |

กฎเหล็ก: **ทำตามลำดับ 11 → 12 → 13 ห้ามข้าม** แต่ละ Phase ต้องเสร็จ
สมบูรณ์และเสถียรก่อนเริ่ม Phase ถัดไป ถ้าใกล้ deadline ให้หยุดที่ Phase
ล่าสุดที่เสร็จสมบูรณ์ แล้วโชว์ของที่สมบูรณ์นั้น ดีกว่ามี Phase ที่ทำ
ครึ่งๆ กลางๆ แล้วทั้งระบบดูไม่เสถียร

---

## Tips การใช้ agent ให้ได้ผล

- ถ้า agent เริ่มเขียนโค้ดยาวๆ ไม่หยุด ให้ตัดบทด้วย: *"หยุด อธิบายสิ่งที่เพิ่งเขียนให้ฟังก่อน"*
- ทุกจบ Phase ให้ถามตัวเองว่า "ถ้ามีคนถามว่าส่วนนี้ทำงานยังไง ฉันอธิบายได้ไหม" ถ้าไม่ได้ ให้ถาม agent ซ้ำก่อนไปต่อ
- เก็บทุก prompt+คำตอบสำคัญไว้ เพื่อเอาไปเขียน README ตอนท้ายสำหรับพอร์ตงาน
