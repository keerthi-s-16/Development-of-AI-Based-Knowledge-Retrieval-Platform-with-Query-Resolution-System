import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database.connection import get_db
from app.models.query import Query as QueryModel
from app.rag_engine import get_answer_from_pdf


router = APIRouter(
    prefix="/query",
    tags=["query"]
)


class QueryRequest(BaseModel):
    query: str


@router.post("/")
async def query_api(
    request: QueryRequest,
    db: AsyncSession = Depends(get_db)
):
    query = request.query

    answer = get_answer_from_pdf(query)

    new_query = QueryModel(
        id=str(uuid.uuid4()),
        question=query,
        answer=answer
    )

    db.add(new_query)
    await db.commit()

    return {
        "question": query,
        "answer": answer
    }


@router.get("/history")
async def get_history(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(QueryModel)
    )

    history = result.scalars().all()

    return {
        "history": history
    }