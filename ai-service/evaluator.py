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

def evaluate_latency(test_cases: list[dict]) -> dict:
    """
    วัดเวลาตอบสนองของระบบ Rule-based Recommendation

    รัน rank_tutors() ทุก test case แล้วเก็บเวลาแต่ละครั้ง
    คืน mean, p50, p95 เพื่อให้เห็นภาพรวมและ worst-case

    Returns:
        dict ที่มี:
        - mean: เวลาเฉลี่ย (วินาที)
        - p50:  เวลาที่ 50th percentile (median)
        - p95:  เวลาที่ 95th percentile (worst-case จริง)
        - min:  เร็วที่สุด
        - max:  ช้าที่สุด
        - n:    จำนวน test case ที่วัด
    """
    latencies = []

    for tc in test_cases:
        req = StudentRequirement(**tc["requirement"])

        # จับเวลา start
        start = time.perf_counter()
        rank_tutors(req, TUTORS)
        # จับเวลา end
        elapsed = time.perf_counter() - start

        latencies.append(elapsed)

    # เรียงจากน้อยไปมากเพื่อคำนวณ percentile
    latencies.sort()
    n = len(latencies)

    def percentile(sorted_list: list[float], p: float) -> float:
        """คำนวณ percentile จาก sorted list"""
        idx = int(p / 100 * n)
        idx = min(idx, n - 1)  # ป้องกัน index เกิน
        return round(sorted_list[idx], 6)

    return {
        "n":    n,
        "mean": round(sum(latencies) / n, 6),
        "p50":  percentile(latencies, 50),
        "p95":  percentile(latencies, 95),
        "min":  round(latencies[0], 6),
        "max":  round(latencies[-1], 6),
    }

if __name__ == "__main__":
    """
    Script สรุปผลการ Evaluation
    รันด้วยคำสั่ง: python evaluator.py
    """
    print("=" * 55)
    print("   TUTEE RECOMMENDATION EVALUATION REPORT")
    print("=" * 55)
    print(f"   Total test cases: {len(TEST_CASES)}")

    # --- แบ่ง test cases ตาม category ---
    by_category = {}
    for tc in TEST_CASES:
        cat = tc["category"]
        by_category.setdefault(cat, []).append(tc)

    # --- Top-K Accuracy ---
    print("\n[1] TOP-K ACCURACY")
    print("-" * 55)

    top1_all = evaluate_top_k(TEST_CASES, k=1)
    top3_all = evaluate_top_k(TEST_CASES, k=3)
    print(f"   {'Metric':<25} {'Value':>10}")
    print(f"   {'-'*35}")
    print(f"   {'Top-1 Accuracy (all)':<25} {top1_all:>9.1%}")
    print(f"   {'Top-3 Accuracy (all)':<25} {top3_all:>9.1%}")

    print(f"\n   {'Category':<20} {'Top-1':>8} {'Top-3':>8} {'Count':>7}")
    print(f"   {'-'*45}")
    for cat, cases in by_category.items():
        t1 = evaluate_top_k(cases, k=1)
        t3 = evaluate_top_k(cases, k=3)
        print(f"   {cat:<20} {t1:>7.1%} {t3:>8.1%} {len(cases):>7}")

    # --- Latency ---
    print("\n[2] RESPONSE LATENCY (Rule-based only)")
    print("-" * 55)
    latency = evaluate_latency(TEST_CASES)
    print(f"   {'Metric':<25} {'Value (ms)':>12}")
    print(f"   {'-'*39}")
    print(f"   {'Test cases (n)':<25} {latency['n']:>12}")
    print(f"   {'Mean latency':<25} {latency['mean']*1000:>11.3f}")
    print(f"   {'P50 (median)':<25} {latency['p50']*1000:>11.3f}")
    print(f"   {'P95 (worst 5%)':<25} {latency['p95']*1000:>11.3f}")
    print(f"   {'Min latency':<25} {latency['min']*1000:>11.3f}")
    print(f"   {'Max latency':<25} {latency['max']*1000:>11.3f}")

    print("\n" + "=" * 55)
    print("   Evaluation complete.")
    print("=" * 55)
