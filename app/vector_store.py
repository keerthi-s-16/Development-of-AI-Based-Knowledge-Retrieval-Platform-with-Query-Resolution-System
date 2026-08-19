from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = []
index = None


def build_index(chunks):
    global texts, index

    texts = chunks

    if not chunks:
        index = None
        return

    embeddings = model.encode(
        chunks,
        convert_to_numpy=True
    ).astype("float32")

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)


def search(query, k=5):
    if index is None or not texts:
        return []

    k = min(k, len(texts))

    query_vec = model.encode(
        [query],
        convert_to_numpy=True
    ).astype("float32")

    _, indices = index.search(query_vec, k)

    return [
        texts[idx]
        for idx in indices[0]
        if 0 <= idx < len(texts)
    ]
