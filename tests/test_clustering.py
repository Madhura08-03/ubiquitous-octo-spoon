"""
tests/test_clustering.py
========================
Unit tests for the Root-Cause Clustering engine (clustering.py).
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from clustering import perform_monthly_root_cause_clustering
from schemas import ClusterItem, ClusterReportsRequest, ClusterReportsResponse


class TestRootCauseClustering:

    def test_cross_regional_root_cause_clustering(self):
        """
        Verify that a village report and an urban city report sharing the same
        underlying root cause (e.g., pollution causing water scarcity) are
        clustered into a single Cross-Regional Cluster!
        """
        reports = [
            ClusterItem(
                id="REP_RURAL_01",
                title="Severe Water Scarcity due to River Pollution",
                description="Our village Ormanjhi is facing terrible drinking water scarcity because factory pollution has ruined the local river.",
                domain="Water Management",
                region_name="Ormanjhi Village",
                region_type="RURAL",
            ),
            ClusterItem(
                id="REP_URBAN_01",
                title="Urban Water Supply Contamination from Chemical Pollution",
                description="City Sector 4 residents have no clean drinking water because chemical pollution infected the municipal water intake.",
                domain="Water Management",
                region_name="Ranchi Urban Sector 4",
                region_type="URBAN",
            ),
            ClusterItem(
                id="REP_RURAL_02",
                title="Road Damage Potholes in Remote Village",
                description="Main village road has deep potholes and broken subgrade.",
                domain="Urban Infrastructure & Roads",
                region_name="Kanke Village",
                region_type="RURAL",
            ),
        ]

        req = ClusterReportsRequest(reports=reports)
        res: ClusterReportsResponse = perform_monthly_root_cause_clustering(req)

        assert res.total_reports_analyzed == 3
        assert res.total_clusters_found >= 1
        
        # Check if the water pollution cluster was created & marked as cross-regional!
        water_clusters = [c for c in res.clusters if "REP_RURAL_01" in c.report_ids]
        assert len(water_clusters) == 1
        water_cluster = water_clusters[0]

        assert "REP_URBAN_01" in water_cluster.report_ids
        assert water_cluster.is_cross_regional is True
        assert len(water_cluster.affected_regions) == 2
        assert "Bio-Remediation" in water_cluster.recommended_solution_category or "Filtration" in water_cluster.recommended_solution_category
