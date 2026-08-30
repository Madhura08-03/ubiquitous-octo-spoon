import uuid
from typing import List
from pydantic import BaseModel, ConfigDict


class UniversityRankingItem(BaseModel):
    rank: int
    university_id: uuid.UUID
    name: str
    points: int
    successful_milestones: int

    model_config = ConfigDict(from_attributes=True)


class UniversityRankingResponse(BaseModel):
    items: List[UniversityRankingItem]
    total: int
    limit: int
    offset: int


class IndustryRankingItem(BaseModel):
    rank: int
    industry_id: uuid.UUID
    name: str
    points: int
    successful_contributions: int

    model_config = ConfigDict(from_attributes=True)


class IndustryRankingResponse(BaseModel):
    items: List[IndustryRankingItem]
    total: int
    limit: int
    offset: int
