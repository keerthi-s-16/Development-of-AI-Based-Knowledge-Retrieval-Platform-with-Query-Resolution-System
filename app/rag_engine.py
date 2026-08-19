from langchain_ollama import OllamaLLM
from app.vector_store import build_index, search

pdf_text = ""
pdf_chunks = []

llm = OllamaLLM(model="llama3.2:1b")


def set_pdf_text(text: str):
    global pdf_text
    pdf_text = text


def split_into_chunks(text: str, chunk_size: int = 500):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)

    return chunks


def index_pdf(text: str):
    global pdf_text, pdf_chunks

    pdf_text = text
    pdf_chunks = split_into_chunks(text)

    build_index(pdf_chunks)

    return {
        "message": "PDF indexed successfully",
        "chunks": len(pdf_chunks)
    }


def generate_ai_answer(query: str, context: str):
    prompt = f"""
You are an AI assistant that answers questions from an uploaded PDF.

Rules:
- Answer ONLY using the PDF context.
- Do not invent information.
- Understand the meaning of the question.
- Give a direct and clear answer.
- If the answer is not present, say:
"The answer is not available in the uploaded PDF."
- If asked what the PDF is about, give a short summary.

PDF CONTEXT:
{context}

USER QUESTION:
{query}

ANSWER:
"""

    try:
        response = llm.invoke(prompt)

        if not response:
            return "The AI could not generate an answer."

        return response.strip()

    except Exception as e:
        return f"AI answer generation failed: {str(e)}"


def get_answer_from_pdf(query: str):
    if not pdf_text.strip():
        return "No PDF has been uploaded yet."

    relevant_chunks = search(query, k=5)

    if not relevant_chunks:
        return "The answer is not available in the uploaded PDF."

    context = "\n\n".join(relevant_chunks)

    return generate_ai_answer(query, context)
