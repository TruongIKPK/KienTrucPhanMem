"""
URL Configuration for Django Project
"""
from django.urls import path, include

urlpatterns = [
    path('', include('tasks.urls')),
]
