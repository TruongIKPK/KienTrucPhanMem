from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from celery.result import AsyncResult
from .tasks import long_running_task, add_numbers, send_email_async, process_data
from .models import TaskResult

def index(request):
    """Home page with task submission form"""
    return render(request, 'index.html')

@require_http_methods(["GET"])
def list_tasks(request):
    """List all tasks"""
    tasks = TaskResult.objects.all()[:50]
    return render(request, 'tasks_list.html', {'tasks': tasks})

@require_http_methods(["GET"])
def get_task(request, task_id):
    """Get task details"""
    try:
        task_result = AsyncResult(task_id)
        return JsonResponse({
            'task_id': task_id,
            'status': task_result.status,
            'result': task_result.result if task_result.ready() else None,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@require_http_methods(["POST"])
def submit_task(request):
    """Submit a new task"""
    task_type = request.POST.get('task_type', 'long_running')
    
    try:
        if task_type == 'long_running':
            duration = int(request.POST.get('duration', 10))
            task = long_running_task.delay(duration)
        elif task_type == 'add':
            x = int(request.POST.get('x', 5))
            y = int(request.POST.get('y', 3))
            task = add_numbers.delay(x, y)
        elif task_type == 'email':
            recipient = request.POST.get('recipient', 'test@example.com')
            subject = request.POST.get('subject', 'Test Subject')
            message = request.POST.get('message', 'Test message')
            task = send_email_async.delay(recipient, subject, message)
        elif task_type == 'process':
            data = request.POST.get('data', '100')
            task = process_data.delay(data)
        else:
            return JsonResponse({'error': 'Invalid task type'}, status=400)
        
        return JsonResponse({
            'task_id': task.id,
            'status': 'submitted',
            'message': f'Task {task_type} submitted successfully'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
