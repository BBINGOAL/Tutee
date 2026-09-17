import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# We need to construct the DSN or use DATABASE_URL from .env.
# If .env has DATABASE_URL for backend, we can reuse it, but parse it.
# Actually, ai-service can connect to the same DB URL.
DATABASE_URL = os.getenv("DATABASE_URL", "postgres://postgres:postgres@localhost:5435/tutee")

def get_db_connection():
    """
    สร้าง connection ไปยัง PostgreSQL
    """
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS tutor_embeddings (
                        id SERIAL PRIMARY KEY,
                        tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
                        field_name TEXT NOT NULL,
                        embedding VECTOR(384) NOT NULL,
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                """)
                cur.execute("""
                    CREATE INDEX IF NOT EXISTS idx_tutor_embeddings_vector
                    ON tutor_embeddings
                    USING ivfflat (embedding vector_cosine_ops)
                    WITH (lists = 10);
                """)
            conn.commit()
            print("AI Service DB initialized (pgvector ready)")
        except Exception as e:
            print(f"Failed to init DB: {e}")
        finally:
            conn.close()

# เรียกใช้งานตอนโหลด module เลย
init_db()
