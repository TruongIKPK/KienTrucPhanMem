from celery import shared_task
from django.utils import timezone
import time
import random
from .models import TaskResult

@shared_task(bind=True)
def long_running_task(self, duration=10):
    """Simulate a long-running task"""
    task_result = TaskResult.objects.create(
        task_id=self.request.id,
        task_name='long_running_task',
        status='STARTED'
    )
    
    try:
        for i in range(duration):
            # Update progress
            self.update_state(
                state='PROGRESS',
                meta={
                    'current': i,
                    'total': duration,
                    'status': f'Processing {i}/{duration}'
                }
            )
            time.sleep(1)
        
        result = f"Task completed after {duration} seconds"
        task_result.status = 'SUCCESS'
        task_result.result = result
        task_result.completed_at = timezone.now()
        task_result.save()
        
        return result
    except Exception as exc:
        task_result.status = 'FAILURE'
        task_result.result = str(exc)
        task_result.completed_at = timezone.now()
        task_result.save()
        raise exc

@shared_task
def add_numbers(x, y):
    """Simple task to add two numbers"""
    result = x + y
    TaskResult.objects.create(
        task_id=add_numbers.name,
        task_name='add_numbers',
        status='SUCCESS',
        result=f"{x} + {y} = {result}",
        completed_at=timezone.now()
    )
    return result

@shared_task
def send_email_async(recipient, subject, message):
    """Simulate sending email asynchronously"""
    try:
        # Simulate email sending
        time.sleep(2)
        result = f"Email sent to {recipient} with subject: {subject}"
        TaskResult.objects.create(
            task_id=send_email_async.name,
            task_name='send_email_async',
            status='SUCCESS',
            result=result,
            completed_at=timezone.now()
        )
        return result
    except Exception as exc:
        TaskResult.objects.create(
            task_id=send_email_async.name,
            task_name='send_email_async',
            status='FAILURE',
            result=str(exc),
            completed_at=timezone.now()
        )
        raise exc

@shared_task
def process_data(data):
    """Process data and return statistics"""
    try:
        numbers = [random.randint(1, 100) for _ in range(int(data))]
        result = {
            'count': len(numbers),
            'sum': sum(numbers),
            'average': sum(numbers) / len(numbers) if numbers else 0,
            'min': min(numbers) if numbers else 0,
            'max': max(numbers) if numbers else 0,
        }
        
        TaskResult.objects.create(
            task_id=process_data.name,
            task_name='process_data',
            status='SUCCESS',
            result=str(result),
            completed_at=timezone.now()
        )
        return result
    except Exception as exc:
        TaskResult.objects.create(
            task_id=process_data.name,
            task_name='process_data',
            status='FAILURE',
            result=str(exc),
            completed_at=timezone.now()
        )
        raise exc
