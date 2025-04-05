// Sélection des éléments du DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const pendingTasksEl = document.getElementById('pending-tasks');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');

// État initial de l'application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editingId = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialisation de l'application
function init() {
    renderTasks();
    updatePendingTasksCount();
    setTheme(currentTheme);

    // Ajout des écouteurs d'événements
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskAction);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Écouteurs pour les filtres
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
}

// Fonction pour ajouter une tâche
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    if (!taskText) return;
    
    if (editingId !== null) {
        // Mode édition: mettre à jour la tâche existante
        tasks = tasks.map(task =>
            task.id === editingId ? { ...task, text: taskText } : task
        );
        editingId = null;
        document.querySelector('#add-button i').className = 'fas fa-plus';
    } else {
        // Mode ajout: créer une nouvelle tâche
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        tasks.push(newTask);
    }
    
    // Sauvegarde et mise à jour de l'interface
    saveTasks();
    renderTasks();
    updatePendingTasksCount();
    
    // Réinitialisation du formulaire
    taskInput.value = '';
    taskInput.focus();
}

// Fonction pour gérer les actions sur les tâches (compléter, éditer, supprimer)
function handleTaskAction(e) {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.dataset.id);
    
    // Gestion des cases à cocher
    if (target.classList.contains('task-checkbox')) {
        toggleTaskStatus(taskId);
    }
    
    // Gestion du bouton d'édition
    if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
        editTask(taskId);
    }
    
    // Gestion du bouton de suppression
    if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
        deleteTask(taskId);
    }
}

// Fonction pour basculer l'état d'une tâche (terminée/à faire)
function toggleTaskStatus(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    saveTasks();
    renderTasks();
    updatePendingTasksCount();
}

// Fonction pour éditer une tâche
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    editingId = id;
    taskInput.value = task.text;
    taskInput.focus();
    
    // Changer l'icône du bouton
    document.querySelector('#add-button i').className = 'fas fa-save';
}

// Fonction pour supprimer une tâche
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    
    if (editingId === id) {
        editingId = null;
        taskInput.value = '';
        document.querySelector('#add-button i').className = 'fas fa-plus';
    }
    
    saveTasks();
    renderTasks();
    updatePendingTasksCount();
}

// Fonction pour effacer toutes les tâches terminées
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    
    saveTasks();
    renderTasks();
    updatePendingTasksCount();
}

// Fonction pour définir le filtre actif
function setFilter(filter) {
    currentFilter = filter;
    
    // Mettre à jour les classes des boutons de filtre
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    renderTasks();
}

// Fonction pour filtrer les tâches selon le filtre actif
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Fonction pour mettre à jour le compteur de tâches restantes
function updatePendingTasksCount() {
    const pendingCount = tasks.filter(task => !task.completed).length;
    pendingTasksEl.textContent = `${pendingCount} tâche${pendingCount !== 1 ? 's' : ''} restante${pendingCount !== 1 ? 's' : ''}`;
}

// Fonction pour rendre les tâches dans le DOM
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Aucune tâche à afficher';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Fonction pour échapper les caractères HTML (sécurité)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction pour sauvegarder les tâches dans le localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour basculer entre les thèmes clair et sombre
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Fonction pour définir le thème
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Mettre à jour l'icône du bouton de thème
    const themeIcon = themeToggle.querySelector('i');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);