let tasks = [];
const token = localStorage.getItem('token');

// Check auth
function checkAuth() {
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Fetch tasks from API
async function fetchTasks() {
    try {
        tasks = await api.getTasks(token);
        renderTasks();
    } catch (err) {
        console.error('Error fetching tasks:', err);
        if (err.status === 401) {
            logout();
        }
    }
}

// Add task
async function addTask(event) {
    event.preventDefault();
    
    const task = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        fee: parseFloat(document.getElementById('taskFee').value)
    };

    try {
        const newTask = await api.createTask(task, token);
        tasks.push(newTask);
        renderTasks();
        event.target.reset();
    } catch (err) {
        console.error('Error adding task:', err);
        alert('Failed to add task');
    }
}

// Delete task
async function deleteTask(taskId) {
    try {
        await api.deleteTask(taskId, token);
        tasks = tasks.filter(task => task._id !== taskId);
        renderTasks();
    } catch (err) {
        console.error('Error deleting task:', err);
        alert('Failed to delete task');
    }
}

// Toggle task status
async function toggleTaskStatus(taskId) {
    try {
        const task = tasks.find(t => t._id === taskId);
        if (task) {
            const updatedTask = await api.updateTask(taskId, {
                status: task.status === 'pending' ? 'completed' : 'pending'
            }, token);
            
            const taskElement = document.querySelector(`li[data-task-id="${taskId}"]`);
            if (updatedTask.status === 'completed' && taskElement) {
                taskElement.classList.add('opacity-0', 'transform', 'translate-y-3');
                setTimeout(() => {
                    tasks = tasks.filter(t => t._id !== taskId);
                    renderTasks();
                }, 300);
            }
        }
    } catch (err) {
        console.error('Error updating task:', err);
        alert('Failed to update task');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initial load
const currentUser = checkAuth();
if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name.toLowerCase();
    fetchTasks();
}

// Display user name
if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name.toLowerCase();
}

function getPriorityColor(priority) {
    const colors = {
        low: 'bg-blue-100 dark:bg-blue-500/30 text-blue-800 dark:text-blue-200',
        medium: 'bg-yellow-100 dark:bg-yellow-500/30 text-yellow-800 dark:text-yellow-200',
        high: 'bg-red-100 dark:bg-red-500/30 text-red-800 dark:text-red-200'
    };
    return colors[priority] || 'bg-gray-100 dark:bg-gray-500/30 text-gray-800 dark:text-gray-200';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will show only the date in the local format
}

function renderTasks() {
    console.log("Rendering tasks:", tasks); // Debug log
    const todoList = document.getElementById('todoList');
    const filterPriority = document.getElementById('filterPriority').value;

    let filteredTasks = tasks;
    if (filterPriority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    // Sort tasks by priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    filteredTasks.sort((a, b) => {
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    });

    console.log("Filtered and sorted tasks:", filteredTasks); // Debug log

    todoList.innerHTML = filteredTasks.map(task => `
        <li data-task-id="${task.id}" 
            class="bg-white dark:bg-zinc-800 rounded-xl p-3 sm:p-4 transition-all duration-300 ease-in-out transform">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div class="w-full sm:w-auto">
                        <h3 class="font-semibold dark:text-gray-100 text-sm sm:text-base ${task.status === 'completed' ? 'line-through' : ''}">${task.title.toLowerCase()}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">${task.description.toLowerCase()}</p>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto justify-end">
                        <button onclick="toggleTaskStatus(${task.id})" 
                            class="bg-green-500 hover:bg-green-600 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors duration-200 text-sm sm:text-base flex items-center justify-center">
                            ✓
                        </button>
                        <button onclick="deleteTask(${task.id})" 
                            class="bg-red-500 hover:bg-red-600 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-colors duration-200 text-sm sm:text-base flex items-center justify-center">
                            ×
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span class="${getPriorityColor(task.priority)} dark:bg-opacity-20 px-2 py-0.5 sm:py-1 rounded-md">
                        ${task.priority.toLowerCase()}
                    </span>
                    <span class="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-0.5 sm:py-1 rounded-md">
                        due: ${formatDate(task.dueDate).toLowerCase()}
                    </span>
                    <span class="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-0.5 sm:py-1 rounded-md">
                        fee: $${task.fee.toFixed(2)}
                    </span>
                </div>
            </div>
        </li>
    `).join('');
}

function clearAllTasks() {
    tasks = [];
    localStorage.removeItem('tasks');
    renderTasks();
}

// Event Listeners
document.getElementById('taskForm').addEventListener('submit', addTask);
document.getElementById('filterPriority').addEventListener('change', renderTasks);

// Add this after your event listeners
document.querySelector('label[for="taskDueDate"]').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default label behavior
    document.getElementById('taskDueDate').showPicker();
});

// Initial render
renderTasks();

// Dark mode handling
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark);
        
        // Toggle icons
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');
    });
}

// Call after DOM is loaded
initDarkMode();

// Add touch event handling for better mobile interaction
function addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('todoList').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.getElementById('todoList').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(e.target.closest('li'));
    }, false);
    
    function handleSwipe(taskElement) {
        const swipeLength = touchEndX - touchStartX;
        if (!taskElement) return;
        
        // Left swipe (delete)
        if (swipeLength < -100) {
            const taskId = taskElement.dataset.taskId;
            deleteTask(parseInt(taskId));
        }
        // Right swipe (complete)
        else if (swipeLength > 100) {
            const taskId = taskElement.dataset.taskId;
            toggleTaskStatus(parseInt(taskId));
        }
    }
}

// Initialize touch support
addTouchSupport(); 