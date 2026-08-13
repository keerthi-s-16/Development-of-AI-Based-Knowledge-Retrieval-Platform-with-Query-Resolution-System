from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.ai import get_ai_answer
from app.auth.dependencies import get_current_user
from app.schemas.auth import UserPublic
from app.database.connection import get_db
from app.models.query import Query as QueryModel


router = APIRouter(
    prefix="/query",
    tags=["query"]
)


# =========================
# NORMAL QUERY API
# =========================

@router.post("/")
async def query_api(
    query: str,
    current_user: UserPublic = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Normal response without Gemini
    answer = get_ai_answer(query)

    # Save query to database
    new_query = QueryModel(
        user_id=current_user.id,
        question=query,
        answer=answer
    )

    db.add(new_query)

    await db.commit()
    await db.refresh(new_query)

    return {
        "question": query,
        "answer": answer,
        "user": current_user.email
    }


# =========================
# QUERY HISTORY
# =========================

@router.get("/history")
async def get_history(
    current_user: UserPublic = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(QueryModel).where(
            QueryModel.user_id == current_user.id
        )
    )

    return result.scalars().all()