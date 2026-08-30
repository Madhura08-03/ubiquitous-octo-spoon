from enum import Enum as PyEnum
from typing import Any, Dict


class PointCategory(str, PyEnum):
    ENGAGEMENT = "ENGAGEMENT"  # Milestone contribution/engagement points
    FINAL_VERIFIED_REWARD = "FINAL_VERIFIED_REWARD"  # Final verified solution reward


class PointReason(str, PyEnum):
    # Milestone engagement & contribution events (Active in MVP)
    TEAM_FORMED = "TEAM_FORMED"
    STUDENT_TEAM_JOINED = "STUDENT_TEAM_JOINED"
    SOLUTION_SUBMITTED = "SOLUTION_SUBMITTED"
    INDUSTRY_APPROVED = "INDUSTRY_APPROVED"
    INDUSTRY_REVIEW_COMPLETED = "INDUSTRY_REVIEW_COMPLETED"
    PROTOTYPE_SUBMITTED = "PROTOTYPE_SUBMITTED"
    PROTOTYPE_APPROVED = "PROTOTYPE_APPROVED"
    PROBLEM_RESOLVED = "PROBLEM_RESOLVED"

    # Future final verification reward event (Reserved for post-prototype verification)
    FINAL_SOLUTION_VERIFIED = "FINAL_SOLUTION_VERIFIED"


# Centralized, deterministic point configuration for milestone contribution/engagement events
POINT_CONFIG: Dict[PointReason, Dict[str, Any]] = {
    PointReason.TEAM_FORMED: {
        "category": PointCategory.ENGAGEMENT,
        "university_points": 50,
        "description": "Contribution points awarded to university mentor upon verified team formation",
    },
    PointReason.STUDENT_TEAM_JOINED: {
        "category": PointCategory.ENGAGEMENT,
        "student_points": 20,
        "description": "Contribution points awarded to student upon joining a verified team",
    },
    PointReason.INDUSTRY_APPROVED: {
        "category": PointCategory.ENGAGEMENT,
        "university_points": 100,
        "student_team_total_points": 100,
        "description": "Contribution points awarded to university mentor and student team upon industry solution approval",
    },
    PointReason.INDUSTRY_REVIEW_COMPLETED: {
        "category": PointCategory.ENGAGEMENT,
        "industry_points": 50,
        "description": "Contribution points awarded to industry reviewer upon completing a technical review",
    },
    PointReason.PROTOTYPE_APPROVED: {
        "category": PointCategory.ENGAGEMENT,
        "university_points": 200,
        "student_team_total_points": 200,
        "description": "Reserved for future prototype validation milestone",
    },
    PointReason.PROBLEM_RESOLVED: {
        "category": PointCategory.ENGAGEMENT,
        "university_points": 300,
        "student_team_total_points": 300,
        "description": "Reserved for final problem resolution milestone",
    },
}


class ProblemComplexity(str, PyEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


BASE_COMPLEXITY_POINTS: Dict[ProblemComplexity, int] = {
    ProblemComplexity.LOW: 100,
    ProblemComplexity.MEDIUM: 250,
    ProblemComplexity.HIGH: 500,
}


def calculate_novelty_multiplier(novelty_score: float, is_manually_approved: bool = False) -> float:
    """
    JSIE Novelty Multiplier:
    - 70 to 100: 1.0x
    - 40 to 69 (manually approved): 0.8x
    - Below 40 or unapproved: 0.0x
    """
    if novelty_score >= 70.0:
        return 1.0
    elif 40.0 <= novelty_score < 70.0 and is_manually_approved:
        return 0.8
    return 0.0


def calculate_implementation_quality_factor(quality_score: float) -> float:
    """
    JSIE Implementation Quality Factor:
    - 80 to 100: 1.2x
    - 60 to 79: 1.0x
    - Below 60: 0.0x
    """
    if quality_score >= 80.0:
        return 1.2
    elif quality_score >= 60.0:
        return 1.0
    return 0.0


def calculate_final_verified_points(
    complexity: ProblemComplexity,
    novelty_score: float,
    quality_score: float,
    is_novelty_manually_approved: bool = False,
) -> int:
    """
    Pure arithmetic formula for final solution verification reward:
    Final Points = round(Base Points * Novelty Multiplier * Implementation Quality Factor)
    Note: This is isolated for future milestone implementation and is not triggered by current MVP routes.
    """
    base = BASE_COMPLEXITY_POINTS[complexity]
    n_mult = calculate_novelty_multiplier(novelty_score, is_novelty_manually_approved)
    q_factor = calculate_implementation_quality_factor(quality_score)
    return int(round(base * n_mult * q_factor))
