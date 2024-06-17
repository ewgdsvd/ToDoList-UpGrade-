document.addEventListener('DOMContentLoaded', () => {
    const TASKS_KEY = 'tasks_index2';
    const addTaskBtn = document.getElementById('add-task-btn');
    const emptyAddTaskBtn = document.getElementById('empty-add-task-btn');
    const modal = document.getElementById('task-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const taskList = document.getElementById('task-list');
    const taskTitleInput = document.getElementById('task-title-input');
    const taskDescInput = document.getElementById('task-desc-input');
    const deadlineInput = document.getElementById('deadline-input');
    const burgerIcon = document.getElementById('burger-icon');
    const sidebar = document.getElementById('sidebar');
    const priorityBtn = document.getElementById('priorityBtn');
    const priorityDropdown = document.getElementById('priorityDropdown');

    let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    let editingTaskIndex = null;
    let selectedPriority = null;

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            taskItem.innerHTML = `
                <div class="task-item-header" onclick="toggleTaskContent(${index})">
                    <span class="task-title">${task.title}</span>
                </div>
                <div class="task-item-body" id="task-body-${index}">
                    <p>${task.description}</p>
                    ${task.deadline ? `<p>Дедлайн: ${task.deadline}</p>` : ''}
                    ${task.priority ? `<p>Приоритет: ${task.priority}</p>` : ''}
                    <div class="task-actions">
                        <button class="focus" style="background: lawngreen" onclick="editTask(event, ${index})">Изменить</button>
                        <button class="focus" style="background: red" onclick="deleteTask(event, ${index})">Удалить</button>
                    </div>
                </div>
            `;

            taskList.appendChild(taskItem);
        });

        const emptyState = document.getElementById('empty-state');
        if (tasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    };

    const saveTasks = () => {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    };

    const addTask = () => {
        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const deadline = deadlineInput.value.trim();

        if (!title) {
            alert('Название задачи не может быть пустым');
            return;
        }

        const newTask = { title, description, deadline, priority: selectedPriority };

        if (editingTaskIndex !== null) {
            tasks[editingTaskIndex] = newTask;
            editingTaskIndex = null;
        } else {
            tasks.push(newTask);
        }

        saveTasks();
        renderTasks();
        taskTitleInput.value = '';
        taskDescInput.value = '';
        deadlineInput.value = '';
        selectedPriority = null;
        priorityBtn.innerText = 'Приоритет';
        modal.classList.add('hidden');
    };

    window.editTask = (event, index) => {
        event.stopPropagation();
        editingTaskIndex = index;
        taskTitleInput.value = tasks[index].title;
        taskDescInput.value = tasks[index].description;
        deadlineInput.value = tasks[index].deadline || '';
        selectedPriority = tasks[index].priority || null;
        priorityBtn.innerText = selectedPriority ? `Приоритет ${selectedPriority}` : 'Приоритет';
        saveTaskBtn.innerText = 'Сохранить';
        modal.classList.remove('hidden');
    };

    window.deleteTask = (event, index) => {
        event.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    window.toggleTaskContent = (index) => {
        const taskBody = document.getElementById(`task-body-${index}`);
        taskBody.classList.toggle('active');
    };

    const openTaskModal = () => {
        editingTaskIndex = null;
        taskTitleInput.value = '';
        taskDescInput.value = '';
        deadlineInput.value = '';
        selectedPriority = null;
        priorityBtn.innerText = 'Приоритет';
        saveTaskBtn.innerText = 'Добавить задачу';
        modal.classList.remove('hidden');
    };

    addTaskBtn.addEventListener('click', openTaskModal);
    emptyAddTaskBtn.addEventListener('click', openTaskModal);

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    saveTaskBtn.addEventListener('click', addTask);

    burgerIcon.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    priorityBtn.addEventListener('click', () => {
        priorityDropdown.classList.toggle('show');
    });

    priorityDropdown.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', (event) => {
            selectedPriority = event.currentTarget.dataset.priority;
            priorityBtn.innerText = `Приоритет ${selectedPriority}`;
            priorityDropdown.classList.remove('show');
        });
    });

    renderTasks();
});
