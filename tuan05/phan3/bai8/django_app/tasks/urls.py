from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/tasks/', views.list_tasks, name='list_tasks'),
    path('api/task/<int:task_id>/', views.get_task, name='get_task'),
    path('api/task/submit/', views.submit_task, name='submit_task'),
]
