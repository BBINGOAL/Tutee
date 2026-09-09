-- เปิดใช้งาน pgvector extension ก่อน
CREATE EXTENSION IF NOT EXISTS vector;

-- ตารางหลักของ Tutor
CREATE TABLE IF NOT EXISTS tutors (
    id               TEXT PRIMARY KEY,
    name             TEXT NOT NULL,
    subjects         TEXT[],           -- array ของ string
    skill_level      TEXT NOT NULL,
    price_per_hour   FLOAT NOT NULL,
    rating           FLOAT NOT NULL,
    experience_years INTEGER NOT NULL,
    availability     TEXT[],
    bio              TEXT,
    teaching_style   TEXT,
    reviews          TEXT[]
);

-- ตาราง vector แยกต่างหาก
-- เหตุผล: vector มีขนาดใหญ่ ไม่ต้องดึงทุกครั้งที่ query tutor
CREATE TABLE IF NOT EXISTS tutor_embeddings (
    id          SERIAL PRIMARY KEY,
    tutor_id    TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    field_name  TEXT NOT NULL,         -- เช่น "bio", "teaching_style", "reviews"
    embedding   VECTOR(384) NOT NULL,  -- 384 มิติ (paraphrase-multilingual-MiniLM)
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Index สำหรับเร่งความเร็ว cosine similarity search
CREATE INDEX IF NOT EXISTS idx_tutor_embeddings_vector
    ON tutor_embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10);
