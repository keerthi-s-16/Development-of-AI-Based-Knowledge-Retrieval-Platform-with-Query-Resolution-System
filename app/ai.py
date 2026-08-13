def get_ai_answer(query: str):
    if "ai" in query.lower():
        return "AI means machines behaving like humans."
    elif "python" in query.lower():
        return "Python is a programming language."
    else:
        return "I don't know. Try asking about AI or Python."