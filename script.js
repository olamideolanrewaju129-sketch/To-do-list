document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dateDisplay = document.getElementById('date-display');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Set Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString(undefined, options);

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    };

    const updateStats = () => {
        const activeTasksCount = tasks.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeTasksCount} ${activeTasksCount === 1 ? 'item' : 'items'} left`;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <div class="task-checkbox"></div>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" title="Delete task">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            // Toggle Complete
            li.querySelector('.task-checkbox').addEventListener('click', () => {
                const originalIndex = tasks.indexOf(task);
                tasks[originalIndex].completed = !tasks[originalIndex].completed;
                saveTasks();
                renderTasks();
            });

            // Delete Task
            li.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const originalIndex = tasks.indexOf(task);
                tasks.splice(originalIndex, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Initial render
    renderTasks();
    updateStats();
});
