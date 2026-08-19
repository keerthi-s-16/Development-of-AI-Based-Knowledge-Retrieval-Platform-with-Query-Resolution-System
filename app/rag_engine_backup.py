import re

# Uploaded PDF text temporary-ஆ store ஆகும்
pdf_text = ""

# PDF chunks store ஆகும்
pdf_chunks = []


def set_pdf_text(text: str):
    global pdf_text
    pdf_text = text


def split_into_chunks(text: str, chunk_size: int = 500):
    """
    PDF text-ஐ small chunks-ஆ பிரிக்கிறது.
    """
    words = text.split()

    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])

        if chunk.strip():
            chunks.append(chunk)

    return chunks


def index_pdf(text: str):
    """
    Uploaded PDF-ஐ index செய்கிறது.
    """
    global pdf_text
    global pdf_chunks

    pdf_text = text

    pdf_chunks = split_into_chunks(text)

    return {
        "message": "PDF indexed successfully",
        "chunks": len(pdf_chunks)
    }


def get_keywords(text: str):
    """
    Query-ல முக்கியமான words மட்டும் எடுக்கிறது.
    """

    words = re.findall(
        r"\b[a-zA-Z0-9]+\b",
        text.lower()
    )

    stop_words = {
        "what", "is", "the", "a", "an",
        "about", "this", "pdf", "tell",
        "me", "please", "give", "of",
        "in", "on", "to", "for",
        "and", "or", "was", "were",
        "are", "that"
    }

    return {
        word
        for word in words
        if word not in stop_words and len(word) > 2
    }


def find_relevant_chunks(query: str, chunks):

    query_keywords = get_keywords(query)

    if not query_keywords:
        return []

    scored_chunks = []

    for chunk in chunks:

        chunk_words = set(
            re.findall(
                r"\b[a-zA-Z0-9]+\b",
                chunk.lower()
            )
        )

        score = len(
            query_keywords & chunk_words
        )

        if score > 0:
            scored_chunks.append(
                (score, chunk)
            )

    scored_chunks.sort(
        key=lambda x: x[0],
        reverse=True
    )

    # Top 3 relevant chunks
    return [
        chunk
        for score, chunk in scored_chunks[:3]
    ]


def get_answer_from_pdf(query: str):

    if not pdf_text.strip():
        return "No PDF has been uploaded yet."

    # Already indexed chunks use பண்ணலாம்
    chunks = pdf_chunks

    if not chunks:
        chunks = split_into_chunks(pdf_text)

    relevant_chunks = find_relevant_chunks(
        query,
        chunks
    )

    if not relevant_chunks:
        return (
            "I couldn't find relevant information "
            "about this question in the uploaded PDF."
        )

    answer = " ".join(relevant_chunks)

    return answer