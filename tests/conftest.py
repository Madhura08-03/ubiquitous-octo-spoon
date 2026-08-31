"""
tests/conftest.py
=================
Shared pytest configuration for the JSIE AI Service test suite.
"""
# Ensure the parent directory is always on the Python path so that
# all test modules can import project modules without relative imports.
import sys
import os

# Insert the project root (parent of this tests/ directory) at the front.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
