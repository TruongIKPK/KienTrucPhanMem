from django.db import models

class TaskResult(models.Model):
    task_id = models.CharField(max_length=100, primary_key=True)
    task_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='PENDING')
    result = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.task_name} - {self.status}"
