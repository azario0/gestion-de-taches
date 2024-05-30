function addTask() {
    let taskInput = document.getElementById('new-task');
    let taskText = taskInput.value.trim();
    if (taskText !== '') {
        window.pywebview.api.add_task(taskText).then(updateTasks);
        taskInput.value = '';
    }
}

function removeTask(task, done) {
    window.pywebview.api.remove_task(task, done).then(updateTasks);
}

function toggleTaskStatus(task, done) {
    window.pywebview.api.toggle_task_status(task, done).then(updateTasks);
}

function showTaskCreator() {
    document.getElementById('task-creator').style.display = 'block';
    document.getElementById('task-history').style.display = 'none';
}

function showHistory() {
    document.getElementById('task-creator').style.display = 'none';
    document.getElementById('task-history').style.display = 'block';
    updateHistory();
}

function updateTasks(data) {
    let response = JSON.parse(data);
    let taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    response.tasks.forEach(task => {
        let listItem = document.createElement('li');

        let taskText = document.createElement('span');
        taskText.textContent = task.task;

        let doneRadio = document.createElement('input');
        doneRadio.type = 'radio';
        doneRadio.name = `status-${task.task}`;
        doneRadio.checked = task.done;
        doneRadio.onchange = () => toggleTaskStatus(task.task, true);

        let doneLabel = document.createElement('label');
        doneLabel.textContent = 'Done';

        let notDoneRadio = document.createElement('input');
        notDoneRadio.type = 'radio';
        notDoneRadio.name = `status-${task.task}`;
        notDoneRadio.checked = !task.done;
        notDoneRadio.onchange = () => toggleTaskStatus(task.task, false);

        let notDoneLabel = document.createElement('label');
        notDoneLabel.textContent = 'Not Done';

        let checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';
        checkboxGroup.appendChild(doneRadio);
        checkboxGroup.appendChild(doneLabel);
        checkboxGroup.appendChild(notDoneRadio);
        checkboxGroup.appendChild(notDoneLabel);

        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Task';
        deleteButton.onclick = () => removeTask(task.task, doneRadio.checked);

        listItem.appendChild(taskText);
        listItem.appendChild(checkboxGroup);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}

function updateHistory() {
    window.pywebview.api.get_tasks().then(data => {
        let response = JSON.parse(data);
        let historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        response.history.forEach(task => {
            let listItem = document.createElement('li');
            listItem.textContent = `${task.task} - ${task.done ? 'Done' : 'Not Done'}`;
            historyList.appendChild(listItem);
        });
    });
}

window.onload = function() {
    window.pywebview.api.get_tasks().then(updateTasks);
}
