import json
import time
from pathlib import Path
from models import Tutor, StudentRequirement
from scorer import rank_tutors

# โหลด Mock Data และ Test Dataset
DATA_PATH    = Path(__file__).parent / "mock_tutors.json"
DATASET_PATH = Path(__file__).parent / "eval_dataset.json"

with open(DATA_PATH, encoding="utf-8") as f:
    TUTORS = [Tutor(**t) for t in json.load(f)]

with open(DATASET_PATH, encoding="utf-8") as f:
    TEST_CASES = json.load(f)


def evaluate_top_k(test_cases: list[dict], k: int) -> float:
    """
    วัด Top-K Accuracy ของระบบ Rule-based Recommendation

    สำหรับแต่ละ test case:
    - เรียก rank_tutors() จาก scorer.py
    - เช็คว่า expected_top1 อยู่ใน top-k ที่ระบบแนะนำไหม
    - skip cases ที่ expected_top1 เป็น null (ไม่มีคำตอบที่ถูก เช่น tc020)

    Args:
        test_cases: list ของ test case จาก eval_dataset.json
        k: จำนวน top-k ที่ต้องการตรวจสอบ (1 = Top-1, 3 = Top-3)

    Returns:
        accuracy: float ระหว่าง 0.0 ถึง 1.0
    """
    correct = 0
    total   = 0

    for tc in test_cases:
        expected = tc["expected_top1"]

        # ข้าม test case ที่ไม่มีคำตอบที่ถูก (เช่น วิชา Music ที่ไม่มีในระบบ)
        if expected is None:
            continue

        total += 1

        # สร้าง StudentRequirement จากข้อมูล test case
        req = StudentRequirement(**tc["requirement"])

        # เรียกระบบแนะนำ
        results = rank_tutors(req, TUTORS)

        # ดึง id ของ top-k
        recommended_ids = [r["tutor"].id for r in results[:k]]

        # เช็คว่า expected อยู่ใน top-k ไหม
        if expected in recommended_ids:
            correct += 1

    return round(correct / total, 4) if total > 0 else 0.0
