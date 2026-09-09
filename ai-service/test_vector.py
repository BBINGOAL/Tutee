from vector_search import search_similar_tutors

queries = [
    "อยากได้ครูที่สอนแบบ hands-on มีโปรเจกต์ให้ทำ",
    "ต้องการครูที่อธิบายเนื้อหาได้ชัดเจน เข้าใจง่าย",
    "อยากได้ครูที่เก่งมาก ระดับสูง มีประสบการณ์",
]

for query in queries:
    print(f'\nQuery: "{query}"')
    print("-" * 60)
    results = search_similar_tutors(query, top_k=3)
    for r in results:
        t = r["tutor"]
        print(f'  {r["similarity"]:.4f} | {t.name}')
        print(f'           bio: {t.bio[:50]}...')
