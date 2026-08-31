"""
clustering.py
=============
Periodic Root-Cause Clustering Engine for the JSIE Societal Innovation Portal.

Industry-Grade Architecture:
-----------------------------
1. Domain-Aware Root Cause Partitioning:
   Groups reports by domain (e.g. Water Management, Urban Infrastructure) and extracts
   hybrid TF-IDF feature matrices (word + char_wb n-grams) for each domain.

2. Cross-Regional Applicability Mapping:
   Clusters reports across distinct geographic regions (Rural Villages vs Urban Municipalities)
   sharing identical underlying root causes (e.g., river pollution causing drinking water scarcity).

3. R&D Transferability:
   Identifies cross-regional clusters so that an engineering solution developed for a village
   problem can be linked to solve the identical problem in urban areas.
"""

from __future__ import annotations

import uuid
from collections import Counter
from typing import List, Dict, Tuple, Optional

import numpy as np
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity

from schemas import ClusterItem, ClusterGroup, ClusterReportsRequest, ClusterReportsResponse
from text_utils import normalize_text

SOLUTION_MAPPING: Dict[str, str] = {
    "water": "Bio-Remediation & Advanced Filtration Systems",
    "drainage": "Subsurface Hydrological Management & Drainage Infrastructure",
    "road": "Full-Depth Pavement Reconstruction & Subgrade Layer Stabilization",
    "pothole": "Polymer-Modified Asphalt Overlay & Repair Maintenance",
    "electricity": "Smart Grid Transformer Balancing & Voltage Regulation",
    "garbage": "Decentralized Solid Waste Processing & Recycling Units",
    "sanitation": "Biogas Sanitation & Underground Sewerage Management",
    "agriculture": "Micro-Irrigation & Solar-Powered Water Pumping",
    "health": "Mobile Tele-Medicine & Cold-Chain Supply Logistics",
}


def perform_monthly_root_cause_clustering(
    request: ClusterReportsRequest,
    similarity_threshold: float = 0.15,
) -> ClusterReportsResponse:
    """
    Executes root-cause clustering over a batch of reports (e.g., monthly collection).
    """
    reports = request.reports
    if not reports:
        return ClusterReportsResponse(
            total_reports_analyzed=0,
            total_clusters_found=0,
            cross_regional_clusters=0,
            clusters=[],
        )

    # Group reports by domain first
    domain_groups: Dict[str, List[ClusterItem]] = {}
    for r in reports:
        dom = r.domain.strip()
        if dom not in domain_groups:
            domain_groups[dom] = []
        domain_groups[dom].append(r)

    all_clusters: List[ClusterGroup] = []
    cross_regional_count = 0

    for domain_name, dom_reports in domain_groups.items():
        if len(dom_reports) == 1:
            r = dom_reports[0]
            all_clusters.append(
                ClusterGroup(
                    cluster_id=f"RC_CLUSTER_{uuid.uuid4().hex[:8].upper()}",
                    root_cause_summary=f"Root cause issue identified [{domain_name}]: {r.title}",
                    affected_regions=[f"{r.region_name} ({r.region_type})"],
                    report_ids=[r.id],
                    is_cross_regional=False,
                    recommended_solution_category=_infer_solution_category(r.domain, r.title, r.description),
                )
            )
            continue

        # Extract normalized texts (removing stopwords to focus on core root cause terms)
        norm_texts = [
            normalize_text(r.title, r.description, remove_stopwords=True)
            for r in dom_reports
        ]

        word_vec = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=1)
        char_vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), sublinear_tf=True, min_df=1)

        try:
            m_word = word_vec.fit_transform(norm_texts)
            m_char = char_vec.fit_transform(norm_texts)
            tfidf = hstack([m_word, m_char])

            cos_sim = cosine_similarity(tfidf)
            cos_dist = np.clip(1.0 - cos_sim, 0.0, 1.0)

            # Cluster using Agglomerative Clustering
            distance_thresh = float(1.0 - similarity_threshold)
            clustering_model = AgglomerativeClustering(
                n_clusters=None,
                distance_threshold=distance_thresh,
                metric="precomputed",
                linkage="average",
            )
            labels = clustering_model.fit_predict(cos_dist)

        except Exception:
            labels = list(range(len(dom_reports)))

        clusters_by_label: Dict[int, List[Tuple[ClusterItem, str]]] = {}
        for idx, lbl in enumerate(labels):
            if lbl not in clusters_by_label:
                clusters_by_label[lbl] = []
            clusters_by_label[lbl].append((dom_reports[idx], norm_texts[idx]))

        for lbl, member_pairs in clusters_by_label.items():
            m_reports = [r for r, _ in member_pairs]
            m_texts = [t for _, t in member_pairs]

            reg_types = set(r.region_type.upper() for r in m_reports)
            is_cross = ("RURAL" in reg_types and "URBAN" in reg_types)
            if is_cross:
                cross_regional_count += 1

            reg_names = sorted(list(set(f"{r.region_name} ({r.region_type})" for r in m_reports)))
            rc_summary = _synthesize_root_cause_summary(m_reports, m_texts)
            sol_cat = _infer_solution_category(domain_name, m_reports[0].title, rc_summary)

            all_clusters.append(
                ClusterGroup(
                    cluster_id=f"RC_CLUSTER_{uuid.uuid4().hex[:8].upper()}",
                    root_cause_summary=rc_summary,
                    affected_regions=reg_names,
                    report_ids=[r.id for r in m_reports],
                    is_cross_regional=is_cross,
                    recommended_solution_category=sol_cat,
                )
            )

    all_clusters.sort(key=lambda c: (c.is_cross_regional, len(c.report_ids)), reverse=True)

    return ClusterReportsResponse(
        total_reports_analyzed=len(reports),
        total_clusters_found=len(all_clusters),
        cross_regional_clusters=cross_regional_count,
        clusters=all_clusters,
    )


def _synthesize_root_cause_summary(
    reports: List[ClusterItem],
    normalized_texts: List[str],
) -> str:
    all_words = []
    for txt in normalized_texts:
        all_words.extend(txt.split())

    counter = Counter(all_words)
    top_keywords = [w for w, _ in counter.most_common(6) if len(w) > 2]
    keywords_str = ", ".join(top_keywords[:4]) if top_keywords else "infrastructure"

    domain = reports[0].domain
    first_title = reports[0].title

    return (
        f"Shared Root Cause Analysis [{domain}]: Key factors ({keywords_str}) "
        f"impacting structural serviceability across affected sectors. (Primary issue: '{first_title}')"
    )


def _infer_solution_category(domain: str, title: str, summary: str) -> str:
    combined = f"{domain} {title} {summary}".lower()
    for key, sol in SOLUTION_MAPPING.items():
        if key in combined:
            return sol
    return "Multi-Disciplinary Engineering & Societal R&D Intervention"
