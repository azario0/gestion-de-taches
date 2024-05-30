import webview
import json

tasks = []
history = []

class API:
    def add_task(self, task):
        global tasks
        task_data = {'task': task, 'done': False}
        tasks.append(task_data)
        return json.dumps({'status': 'success', 'tasks': tasks})

    def remove_task(self, task, done):
        global tasks, history
        tasks = [t for t in tasks if t['task'] != task]
        history.append({'task': task, 'done': done})
        return json.dumps({'status': 'success', 'tasks': tasks, 'history': history})

    def toggle_task_status(self, task, done):
        global tasks
        for t in tasks:
            if t['task'] == task:
                t['done'] = done
        return json.dumps({'status': 'success', 'tasks': tasks})

    def get_tasks(self):
        return json.dumps({'tasks': tasks, 'history': history})

def start_app():
    api = API()
    window = webview.create_window('Task Organizer', 'index.html', js_api=api, width=800, height=600)
    webview.start()

if __name__ == '__main__':
    start_app()
