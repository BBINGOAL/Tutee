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

## Tips การใช้ agent ให้ได้ผล

- ถ้า agent เริ่มเขียนโค้ดยาวๆ ไม่หยุด ให้ตัดบทด้วย: *"หยุด อธิบายสิ่งที่เพิ่งเขียนให้ฟังก่อน"*
- ทุกจบ Phase ให้ถามตัวเองว่า "ถ้ามีคนถามว่าส่วนนี้ทำงานยังไง ฉันอธิบายได้ไหม" ถ้าไม่ได้ ให้ถาม agent ซ้ำก่อนไปต่อ
- เก็บทุก prompt+คำตอบสำคัญไว้ เพื่อเอาไปเขียน README ตอนท้ายสำหรับพอร์ตงาน
