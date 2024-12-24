// Auth functions
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
    return currentUser;
}

// Check auth and get current user
const currentUser = checkAuth();

// Add logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Display user name
if (currentUser) {
    document.getElementById('userName').textContent = currentUser.name.toLowerCase();
}

// Task data structure - now with userId
let tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];

function addTask(event) {
    event.preventDefault();
    
    const dateValue = document.getElementById('taskDueDate').value;
    // Parse the date directly from the YYYY-MM-DD format
    const dueDateTime = new Date(dateValue);

    const task = {
        id: Date.now(),
        userId: currentUser.id,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        dueDate: dueDateTime.toISOString(),
        priority: document.getElementById('taskPriority').value,
        fee: parseFloat(document.getElementById('taskFee').value),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    event.target.reset();
}

function saveTasks() {
    localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function toggleTaskStatus(taskId) {
    const taskElement = document.querySelector(`li[data-task-id="${taskId}"]`);
    const task = tasks.find(t => t.id === taskId);
    
    if (task && taskElement) {
        if (task.status === 'pending') {
            task.status = 'completed';
            // Add fade out animation
            taskElement.classList.add('opacity-0', 'transform', 'translate-y-3');
            
            // Wait for animation to complete before removing
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== taskId);
                saveTasks();
                renderTasks();
            }, 300); // 300ms matches the duration in the CSS transition
        }
    }
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
    return new Date(dateString).toLocaleString();
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
            class="bg-white dark:bg-zinc-800 rounded-xl p-4 transition-all duration-300 ease-in-out transform">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div class="w-full sm:w-auto">
                        <h3 class="font-semibold dark:text-gray-100 ${task.status === 'completed' ? 'line-through' : ''}">${task.title.toLowerCase()}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${task.description.toLowerCase()}</p>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto justify-end">
                        <button onclick="toggleTaskStatus(${task.id})" 
                            class="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-lg transition-colors duration-200">
                            ✓
                        </button>
                        <button onclick="deleteTask(${task.id})" 
                            class="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-lg transition-colors duration-200">
                            ×
                        </button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 text-sm">
                    <span class="${getPriorityColor(task.priority)} dark:bg-opacity-20 px-2 py-1 rounded-md">
                        ${task.priority.toLowerCase()}
                    </span>
                    <span class="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
                        due: ${formatDate(task.dueDate).toLowerCase()}
                    </span>
                    <span class="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
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