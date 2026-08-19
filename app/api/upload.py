from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader

from app.rag_engine import index_pdf


router = APIRouter()

docs = []


@router.post("/upload")
async def upload(file: UploadFile = File(...)):

    reader = PdfReader(file.file)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    # Check PDF text
    if not text.strip():
        return {
            "message": "Could not extract text from PDF",
            "length": 0
        }

    # Store uploaded PDF text
    docs.clear()
    docs.append(text)

    # Create vector database from actual PDF
    index_pdf(text)

    return {
        "message": "File uploaded successfully",
        "length": len(text)
    }