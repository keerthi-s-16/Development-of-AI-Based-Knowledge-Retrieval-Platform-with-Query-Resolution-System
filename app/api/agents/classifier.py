def classify_query(query):
    query = query.lower()

    if "compare" in query:
        return "comparative"
    elif "how" in query:
        return "procedural"
    elif "what" in query or "define" in query:
        return "factual"
    else:
        return "ambiguous"
        