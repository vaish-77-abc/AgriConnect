from typing import TypeVar, Generic
from pydantic import BaseModel


class PaginatedResponse(BaseModel):
    """Standard paginated response wrapper."""
    items: list
    total: int
    page: int
    limit: int
    total_pages: int


def paginate(query, page: int = 1, limit: int = 20) -> dict:
    """
    Apply pagination to a SQLAlchemy query.
    Returns dict with items, total, page, limit, total_pages.
    """
    if page < 1:
        page = 1
    if limit < 1:
        limit = 20
    if limit > 100:
        limit = 100

    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }
