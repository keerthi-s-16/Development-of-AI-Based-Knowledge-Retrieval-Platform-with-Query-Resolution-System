from app.rag_engine import get_answer_from_pdf

# =========================
# 🔧 TOOL 1: PDF RAG TOOL
# =========================
def pdf_tool(query: str):
    try:
        return get_answer_from_pdf(query)
    except Exception as e:
        return f"PDF tool error: {str(e)}"


# =========================
# 🔧 TOOL 2: GENERAL TOOL
# =========================
def general_tool(query: str):
    return f"General answer: {query}"


# =========================
# 🧠 ROUTER
# =========================
def ai_router(query: str):
    query_lower = query.lower()

    pdf_keywords = [
        "pdf", "document", "file", "notes",
        "study", "syllabus", "material"
    ]

    if any(word in query_lower for word in pdf_keywords):
        return "pdf_tool"

    return "general_tool"


# =========================
# 🤖 MAIN AGENT
# =========================
def agent_decision(query: str):
    tool = ai_router(query)

    if tool == "pdf_tool":
        return pdf_tool(query)

    return general_tool(query)