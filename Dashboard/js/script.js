// Sélection des éléments du DOM
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const themeToggle = document.getElementById('theme-toggle');
const currentDateElement = document.getElementById('current-date');
const refreshBtn = document.querySelector('.refresh-btn');
const sections = document.querySelectorAll('.dashboard-section');
const lastUpdateElement = document.getElementById('last-update');

// Données pour la démo (dans une application réelle, ces données viendraient d'une API)
const demoData = {
    fitness: {
        steps: [4231, 7824, 5413, 9241, 3821, 6542, 8732],
        workouts: [
            { date: '18 Mai', type: 'Course', duration: '30 min', calories: 320 },
            { date: '16 Mai', type: 'Musculation', duration: '45 min', calories: 280 },
            { date: '14 Mai', type: 'Natation', duration: '60 min', calories: 450 },
            { date: '11 Mai', type: 'Cyclisme', duration: '50 min', calories: 380 },
            { date: '9 Mai', type: 'Course', duration: '25 min', calories: 290 }
        ],
        monthlyData: {
            steps: [5231, 6824, 7413, 5241, 7821, 9542, 8732, 7123, 5634, 8945, 7345, 6321, 8567, 7432, 6589, 7812, 8245, 6578, 7891, 8456, 7123, 6897, 7345, 8123, 7569, 6785, 8245, 7123, 6897, 7345],
            calories: [320, 450, 380, 290, 420, 510, 470, 390, 310, 480, 430, 360, 470, 410, 350, 420, 460, 380, 430, 470, 390, 370, 400, 450, 410, 360, 460, 390, 370, 400],
            workouts: [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1]
        },
        activityDistribution: {
            labels: ['Course', 'Musculation', 'Natation', 'Cyclisme', 'Yoga'],
            data: [35, 25, 15, 15, 10]
        }
    },
    finance: {
        income: 2500,
        expenses: 1250,
        savings: 1250,
        transactions: [
            { date: '20 Mai', description: 'Supermarché', category: 'Alimentation', amount: -85.42, type: 'expense' },
            { date: '15 Mai', description: 'Salaire', category: 'Revenu', amount: 2500, type: 'income' },
            { date: '12 Mai', description: 'Restaurant', category: 'Loisirs', amount: -42.5, type: 'expense' },
            { date: '10 Mai', description: 'Loyer', category: 'Logement', amount: -850, type: 'expense' },
            { date: '8 Mai', description: 'Freelance', category: 'Revenu', amount: 350, type: 'income' },
            { date: '5 Mai', description: 'Transport', category: 'Déplacement', amount: -45.75, type: 'expense' }
        ],
        monthlyData: {
            incomeVsExpense: {
                labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
                income: [2300, 2400, 2300, 2450, 2500],
                expenses: [1800, 1700, 1950, 1350, 1250]
            },
            savings: [500, 700, 350, 1100, 1250]
        },
        expenseDistribution: {
            labels: ['Logement', 'Alimentation', 'Loisirs', 'Transport', 'Services', 'Autres'],
            data: [45, 20, 15, 10, 7, 3]
        }
    },
    habits: {
        data: [
            { name: 'Exercice', icon: 'fa-running', completed: 3, target: 5, progress: 60 },
            { name: 'Lecture', icon: 'fa-book', completed: 6, target: 7, progress: 85 },
            { name: 'Sommeil 8h', icon: 'fa-bed', completed: 5, target: 7, progress: 70 },
            { name: 'Méditation', icon: 'fa-meditation', completed: 2, target: 5, progress: 40 }
        ],
        heatmap: generateHeatmapData()
    },
    tasks: [
        { text: 'Faire 30 minutes de course', category: 'fitness', completed: true },
        { text: 'Payer la facture d\'électricité', category: 'finance', completed: false },
        { text: 'Méditer pendant 10 minutes', category: 'habit', completed: false },
        { text: 'Prendre rendez-vous chez le médecin', category: 'health', completed: false },
        { text: 'Réviser le rapport mensuel', category: 'work', completed: true }
    ]
};

// Charts (graphiques)
let activityChart = null;
let expensesChart = null;
let fitnessMonthlyChart = null;
let activityDistributionChart = null;
let financeMonthlyChart = null;
let expenseDistributionChart = null;

// État actuel
let currentTheme = localStorage.getItem('theme') || 'light';
let currentSection = 'overview';

// Initialisation de l'application
function init() {
    // Configurer le thème initial
    setTheme(currentTheme);
    
    // Afficher la date actuelle
    updateCurrentDate();
    
    // Initialiser les graphiques
    initCharts();
    
    // Charger les données de démo
    loadDemoData();
    
    // Ajouter les écouteurs d'événements
    setupEventListeners();
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Navigation dans la barre latérale
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Toggle du menu hamburger pour mobile
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Changement de thème
    themeToggle.addEventListener('click', toggleTheme);
    
    // Bouton de rafraîchissement des données
    refreshBtn.addEventListener('click', refreshData);
    
    // Modifier le texte des tâches au clic
    document.getElementById('tasks-list').addEventListener('change', handleTaskCheckboxChange);
    
    // Sélecteurs dans les graphiques
    const activityTypeSelect = document.getElementById('activity-type');
    if (activityTypeSelect) {
        activityTypeSelect.addEventListener('change', () => {
            updateFitnessMonthlyChart(activityTypeSelect.value);
        });
    }
    
    const financeTypeSelect = document.getElementById('finance-type');
    if (financeTypeSelect) {
        financeTypeSelect.addEventListener('change', () => {
            updateFinanceMonthlyChart(financeTypeSelect.value);
        });
    }
    
    // Formulaires des paramètres
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', e => {
            e.preventDefault();
            saveProfileSettings();
        });
    }
    
    const goalsForm = document.getElementById('goals-form');
    if (goalsForm) {
        goalsForm.addEventListener('submit', e => {
            e.preventDefault();
            saveGoalsSettings();
        });
    }
    
    // Gestion des habitudes
    const habitSelect = document.getElementById('habit-select');
    if (habitSelect) {
        habitSelect.addEventListener('change', updateHabitHeatmap);
    }
}

// Gérer la navigation
function handleNavigation(e) {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    
    // Mettre à jour les classes actives pour les liens de navigation
    navLinks.forEach(link => {
        const linkId = link.getAttribute('href').substring(1);
        const parentLi = link.parentElement;
        
        if (linkId === targetId) {
            parentLi.classList.add('active');
        } else {
            parentLi.classList.remove('active');
        }
    });
    
    // Afficher la section correspondante
    sections.forEach(section => {
        if (section.id === targetId) {
            section.classList.add('active');
            currentSection = targetId;
        } else {
            section.classList.remove('active');
        }
    });
    
    // Fermer la sidebar en mode mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// Basculer entre thème clair et sombre
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Appliquer le thème
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = themeToggle.querySelector('i');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Mettre à jour les graphiques si disponibles
    updateChartsTheme();
}

// Mettre à jour les graphiques en fonction du thème
function updateChartsTheme() {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    
    const chartOptions = {
        scales: {
            x: {
                grid: {
                    color: borderColor
                },
                ticks: {
                    color: textColor
                }
            },
            y: {
                grid: {
                    color: borderColor
                },
                ticks: {
                    color: textColor
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
    
    const charts = [activityChart, expensesChart, fitnessMonthlyChart, 
                    activityDistributionChart, financeMonthlyChart, 
                    expenseDistributionChart];
    
    charts.forEach(chart => {
        if (chart) {
            chart.options.scales.x.grid.color = borderColor;
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.grid.color = borderColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.options.plugins.legend.labels.color = textColor;
            chart.update();
        }
    });
}

// Afficher la date actuelle
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('fr-FR', options);
}

// Initialiser les graphiques
function initCharts() {
    // Graphique d'activité hebdomadaire
    const activityCtx = document.getElementById('activity-chart');
    if (activityCtx) {
        activityChart = new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Pas',
                    data: demoData.fitness.steps,
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--fitness-color'),
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' pas';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Graphique de répartition des dépenses
    const expensesCtx = document.getElementById('expenses-chart');
    if (expensesCtx) {
        expensesChart = new Chart(expensesCtx, {
            type: 'doughnut',
            data: {
                labels: demoData.finance.expenseDistribution.labels,
                datasets: [{
                    data: demoData.finance.expenseDistribution.data,
                    backgroundColor: [
                        '#4361ee', '#3a0ca3', '#4cc9f0', '#7209b7', '#f72585', '#fb8500'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Initialiser les autres graphiques en fonction de la section active
    if (currentSection === 'fitness' || currentSection === 'overview') {
        initFitnessCharts();
    }
    
    if (currentSection === 'finances' || currentSection === 'overview') {
        initFinanceCharts();
    }
    
    if (currentSection === 'habits') {
        updateHabitHeatmap();
    }
}

// Initialiser les graphiques de fitness
function initFitnessCharts() {
    // Graphique mensuel de fitness
    const fitnessMonthlyCtx = document.getElementById('fitness-monthly-chart');
    if (fitnessMonthlyCtx) {
        fitnessMonthlyChart = new Chart(fitnessMonthlyCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => i + 1),
                datasets: [{
                    label: 'Pas',
                    data: demoData.fitness.monthlyData.steps,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--fitness-color'),
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--fitness-color')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Graphique de distribution des activités
    const activityDistributionCtx = document.getElementById('activity-distribution-chart');
    if (activityDistributionCtx) {
        activityDistributionChart = new Chart(activityDistributionCtx, {
            type: 'pie',
            data: {
                labels: demoData.fitness.activityDistribution.labels,
                datasets: [{
                    data: demoData.fitness.activityDistribution.data,
                    backgroundColor: [
                        '#4ade80', '#34d399', '#10b981', '#059669', '#047857'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialiser les graphiques des finances
function initFinanceCharts() {
    // Graphique mensuel des finances
    const financeMonthlyCtx = document.getElementById('finance-monthly-chart');
    if (financeMonthlyCtx) {
        financeMonthlyChart = new Chart(financeMonthlyCtx, {
            type: 'bar',
            data: {
                labels: demoData.finance.monthlyData.incomeVsExpense.labels,
                datasets: [
                    {
                        label: 'Revenus',
                        data: demoData.finance.monthlyData.incomeVsExpense.income,
                        backgroundColor: '#4ade80',
                        borderRadius: 5
                    },
                    {
                        label: 'Dépenses',
                        data: demoData.finance.monthlyData.incomeVsExpense.expenses,
                        backgroundColor: '#f87171',
                        borderRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' €';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Graphique de distribution des dépenses
    const expenseDistributionCtx = document.getElementById('expense-distribution-chart');
    if (expenseDistributionCtx) {
        expenseDistributionChart = new Chart(expenseDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: demoData.finance.expenseDistribution.labels,
                datasets: [{
                    data: demoData.finance.expenseDistribution.data,
                    backgroundColor: [
                        '#f59e0b', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Mettre à jour le graphique mensuel de fitness
function updateFitnessMonthlyChart(type) {
    if (!fitnessMonthlyChart) return;
    
    let data;
    let label;
    let color;
    
    switch (type) {
        case 'calories':
            data = demoData.fitness.monthlyData.calories;
            label = 'Calories brûlées';
            color = '#f59e0b';
            break;
        case 'workouts':
            data = demoData.fitness.monthlyData.workouts;
            label = 'Entraînements';
            color = '#60a5fa';
            break;
        default:
            data = demoData.fitness.monthlyData.steps;
            label = 'Pas';
            color = '#4ade80';
    }
    
    fitnessMonthlyChart.data.datasets[0].data = data;
    fitnessMonthlyChart.data.datasets[0].label = label;
    fitnessMonthlyChart.data.datasets[0].borderColor = color;
    fitnessMonthlyChart.data.datasets[0].pointBackgroundColor = color;
    fitnessMonthlyChart.update();
}

// Mettre à jour le graphique mensuel des finances
function updateFinanceMonthlyChart(type) {
    if (!financeMonthlyChart) return;
    
    if (type === 'savings') {
        // Mode économies
        financeMonthlyChart.data.labels = demoData.finance.monthlyData.incomeVsExpense.labels;
        financeMonthlyChart.data.datasets = [{
            label: 'Économies',
            data: demoData.finance.monthlyData.savings,
            backgroundColor: '#60a5fa',
            borderRadius: 5
        }];
    } else {
        // Mode revenus vs dépenses
        financeMonthlyChart.data.labels = demoData.finance.monthlyData.incomeVsExpense.labels;
        financeMonthlyChart.data.datasets = [
            {
                label: 'Revenus',
                data: demoData.finance.monthlyData.incomeVsExpense.income,
                backgroundColor: '#4ade80',
                borderRadius: 5
            },
            {
                label: 'Dépenses',
                data: demoData.finance.monthlyData.incomeVsExpense.expenses,
                backgroundColor: '#f87171',
                borderRadius: 5
            }
        ];
    }
    
    financeMonthlyChart.update();
}

// Mettre à jour la heatmap des habitudes
function updateHabitHeatmap() {
    const habitHeatmap = document.getElementById('habit-heatmap');
    const habitSelect = document.getElementById('habit-select');
    
    if (!habitHeatmap || !habitSelect) return;
    
    const selectedHabit = habitSelect.value;
    const heatmapData = demoData.habits.heatmap;
    
    habitHeatmap.innerHTML = '';
    
    // Générer 90 jours (environ 3 mois) de données pour la heatmap
    for (let i = 0; i < 90; i++) {
        const day = document.createElement('div');
        day.className = 'heatmap-day';
        
        // Intensité basée sur le type d'habitude ou toutes les habitudes
        let intensity = 0;
        
        if (selectedHabit === 'all') {
            // Moyenne de toutes les habitudes
            const dayData = heatmapData[i] || {};
            let sum = 0;
            let count = 0;
            
            for (const habit in dayData) {
                if (dayData.hasOwnProperty(habit)) {
                    sum += dayData[habit];
                    count++;
                }
            }
            
            intensity = count > 0 ? sum / count : 0;
        } else {
            // Intensité d'une habitude spécifique
            intensity = (heatmapData[i] && heatmapData[i][selectedHabit]) || 0;
        }
        
        // Appliquer la couleur en fonction de l'intensité
        if (intensity > 0) {
            day.style.backgroundColor = selectedHabit === 'all' ? 
                `hsla(220, 100%, 50%, ${intensity})` :
                getHabitColor(selectedHabit, intensity);
        }
        
        habitHeatmap.appendChild(day);
    }
}

// Obtenir la couleur d'une habitude en fonction de son intensité
function getHabitColor(habitType, intensity) {
    switch (habitType) {
        case 'exercise':
            return `hsla(150, 100%, 50%, ${intensity})`;
        case 'reading':
            return `hsla(200, 100%, 50%, ${intensity})`;
        case 'sleep':
            return `hsla(250, 100%, 50%, ${intensity})`;
        case 'meditation':
            return `hsla(300, 100%, 50%, ${intensity})`;
        default:
            return `hsla(220, 100%, 50%, ${intensity})`;
    }
}

// Générer des données de heatmap aléatoires
function generateHeatmapData() {
    const heatmapData = [];
    
    for (let i = 0; i < 90; i++) {
        const dayData = {};
        
        // 60% de chances d'avoir des données pour ce jour
        if (Math.random() > 0.4) {
            dayData.exercise = Math.random();
            dayData.reading = Math.random();
            dayData.sleep = Math.random();
            dayData.meditation = Math.random();
        }
        
        heatmapData.push(dayData);
    }
    
    return heatmapData;
}

// Charger les données de démo
function loadDemoData() {
    // Données de fitness
    document.querySelectorAll('.card-value')[0].textContent = demoData.fitness.steps[6]; // Dernière valeur des pas
    
    // Données de finances
    document.querySelectorAll('.card-value')[1].textContent = demoData.finance.savings + ' €';
    
    // Données d'habitudes
    const habitsCompleted = demoData.habits.data.reduce((acc, habit) => acc + habit.completed, 0);
    const habitsTarget = demoData.habits.data.reduce((acc, habit) => acc + habit.target, 0);
    document.querySelectorAll('.card-value')[2].textContent = habitsCompleted + '/' + habitsTarget;
    
    // Tâches
    updateTasksList();
    
    // Mettre à jour la date de dernière mise à jour
    updateLastUpdateTime();
    
    // Autres données spécifiques à chaque section
    updateSectionData();
}

// Mettre à jour les données spécifiques à chaque section
function updateSectionData() {
    // Section Fitness
    if (document.getElementById('fitness').classList.contains('active')) {
        // Mettre à jour les cartes de résumé de fitness
        document.querySelector('#fitness .card-value:nth-of-type(1)').textContent = demoData.fitness.steps[6];
        document.querySelector('#fitness .card-value:nth-of-type(2)').textContent = demoData.fitness.monthlyData.calories[29]; // Dernier jour
        document.querySelector('#fitness .card-value:nth-of-type(3)').textContent = '3'; // Nombre d'entraînements
        
        // Mettre à jour le tableau des entraînements
        updateWorkoutsTable();
    }
    
    // Section Finances
    if (document.getElementById('finances').classList.contains('active')) {
        // Mettre à jour les cartes de résumé des finances
        document.querySelector('#finances .card-value:nth-of-type(1)').textContent = demoData.finance.income + ' €';
        document.querySelector('#finances .card-value:nth-of-type(2)').textContent = demoData.finance.expenses + ' €';
        document.querySelector('#finances .card-value:nth-of-type(3)').textContent = demoData.finance.savings + ' €';
        
        // Mettre à jour le tableau des transactions
        updateTransactionsTable();
    }
    
    // Section Habitudes
    if (document.getElementById('habits').classList.contains('active')) {
        updateHabitCards();
    }
}

// Mettre à jour la liste des tâches
function updateTasksList() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;
    
    tasksList.innerHTML = '';
    
    demoData.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const taskCategory = document.createElement('span');
        taskCategory.className = `task-category ${task.category}`;
        taskCategory.textContent = capitalizeFirstLetter(task.category);
        
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(taskCategory);
        
        tasksList.appendChild(li);
    });
}

// Mettre à jour le tableau des entraînements
function updateWorkoutsTable() {
    const workoutsTable = document.querySelector('.workout-table tbody');
    if (!workoutsTable) return;
    
    workoutsTable.innerHTML = '';
    
    demoData.fitness.workouts.forEach(workout => {
        const tr = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = workout.date;
        
        const typeCell = document.createElement('td');
        typeCell.textContent = workout.type;
        
        const durationCell = document.createElement('td');
        durationCell.textContent = workout.duration;
        
        const caloriesCell = document.createElement('td');
        caloriesCell.textContent = workout.calories;
        
        tr.appendChild(dateCell);
        tr.appendChild(typeCell);
        tr.appendChild(durationCell);
        tr.appendChild(caloriesCell);
        
        workoutsTable.appendChild(tr);
    });
}

// Mettre à jour le tableau des transactions
function updateTransactionsTable() {
    const transactionsTable = document.querySelector('.transaction-table tbody');
    if (!transactionsTable) return;
    
    transactionsTable.innerHTML = '';
    
    demoData.finance.transactions.forEach(transaction => {
        const tr = document.createElement('tr');
        tr.className = transaction.type;
        
        const dateCell = document.createElement('td');
        dateCell.textContent = transaction.date;
        
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = transaction.description;
        
        const categoryCell = document.createElement('td');
        categoryCell.textContent = transaction.category;
        
        const amountCell = document.createElement('td');
        amountCell.textContent = (transaction.amount > 0 ? '+' : '') + transaction.amount.toFixed(2) + ' €';
        
        tr.appendChild(dateCell);
        tr.appendChild(descriptionCell);
        tr.appendChild(categoryCell);
        tr.appendChild(amountCell);
        
        transactionsTable.appendChild(tr);
    });
}

// Mettre à jour les cartes d'habitudes
function updateHabitCards() {
    const habitsGrid = document.querySelector('.habits-grid');
    if (!habitsGrid) return;
    
    // Supprimer toutes les cartes d'habitude sauf la dernière (bouton ajouter)
    const addHabitCard = habitsGrid.querySelector('.add-habit');
    habitsGrid.innerHTML = '';
    
    // Ajouter les cartes d'habitudes
    demoData.habits.data.forEach(habit => {
        const habitCard = document.createElement('div');
        habitCard.className = 'card habit-card';
        
        const habitIcon = document.createElement('div');
        habitIcon.className = 'habit-icon';
        habitIcon.innerHTML = `<i class="fas ${habit.icon}"></i>`;
        
        const habitContent = document.createElement('div');
        habitContent.className = 'habit-content';
        
        habitContent.innerHTML = `
            <h3>${habit.name}</h3>
            <div class="progress-bar">
                <div class="progress" style="width: ${habit.progress}%;">${habit.progress}%</div>
            </div>
            <p>${habit.completed}/${habit.target} jours cette semaine</p>
        `;
        
        habitCard.appendChild(habitIcon);
        habitCard.appendChild(habitContent);
        
        habitsGrid.appendChild(habitCard);
    });
    
    // Réajouter le bouton d'ajout d'habitude
    if (addHabitCard) {
        habitsGrid.appendChild(addHabitCard);
    } else {
        // Créer un nouveau bouton si non trouvé
        const newAddHabitCard = document.createElement('div');
        newAddHabitCard.className = 'card habit-card add-habit';
        newAddHabitCard.innerHTML = `
            <div class="add-habit-icon">
                <i class="fas fa-plus"></i>
            </div>
            <p>Ajouter une habitude</p>
        `;
        habitsGrid.appendChild(newAddHabitCard);
    }
}

// Gérer le changement d'état des tâches
function handleTaskCheckboxChange(e) {
    if (e.target.type === 'checkbox') {
        const taskItem = e.target.closest('.task-item');
        const taskText = taskItem.querySelector('.task-text').textContent;
        
        // Mettre à jour l'état visuel
        taskItem.classList.toggle('completed', e.target.checked);
        
        // Mettre à jour les données
        const taskIndex = demoData.tasks.findIndex(task => task.text === taskText);
        if (taskIndex !== -1) {
            demoData.tasks[taskIndex].completed = e.target.checked;
            updateHabitsStatus();
        }
    }
}

// Mettre à jour le statut des habitudes en fonction des tâches
function updateHabitsStatus() {
    // Calculer le nombre d'habitudes complétées
    const habitsCompleted = demoData.tasks
        .filter(task => task.category === 'habit' && task.completed)
        .length;
    
    // Mettre à jour le compteur sur la page d'accueil
    const habitCounter = document.querySelector('.summary-cards .habits-icon + .card-content .card-value');
    if (habitCounter) {
        const habitTotal = demoData.tasks.filter(task => task.category === 'habit').length;
        habitCounter.textContent = habitsCompleted + '/' + habitTotal;
    }
}

// Rafraîchir toutes les données
function refreshData() {
    // Simuler un chargement
    refreshBtn.querySelector('i').classList.add('fa-spin');
    
    setTimeout(() => {
        // Mise à jour des données simulée
        demoData.fitness.steps = demoData.fitness.steps.map(() => Math.floor(Math.random() * 5000) + 3000);
        
        // Mettre à jour l'interface
        loadDemoData();
        updateChartsData();
        updateLastUpdateTime();
        
        // Arrêter l'animation
        refreshBtn.querySelector('i').classList.remove('fa-spin');
    }, 1000);
}

// Mettre à jour les données des graphiques
function updateChartsData() {
    // Mettre à jour le graphique d'activité hebdomadaire
    if (activityChart) {
        activityChart.data.datasets[0].data = demoData.fitness.steps;
        activityChart.update();
    }
    
    // Mettre à jour les autres graphiques si nécessaire
    if (fitnessMonthlyChart) {
        const type = document.getElementById('activity-type')?.value || 'steps';
        updateFitnessMonthlyChart(type);
    }
    
    if (financeMonthlyChart) {
        const type = document.getElementById('finance-type')?.value || 'income-expense';
        updateFinanceMonthlyChart(type);
    }
}

// Mettre à jour l'heure de la dernière mise à jour
function updateLastUpdateTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit' };
    lastUpdateElement.textContent = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', options);
}

// Enregistrer les paramètres de profil
function saveProfileSettings() {
    const username = document.getElementById('username').value;
    const userWelcome = document.querySelector('.user-profile h3');
    if (userWelcome) {
        userWelcome.textContent = 'Bienvenue, ' + username;
    }
    
    showNotification('Profil mis à jour avec succès');
}

// Enregistrer les paramètres d'objectifs
function saveGoalsSettings() {
    const stepsGoal = document.getElementById('steps-goal').value;
    const workoutGoal = document.getElementById('workout-goal').value;
    
    // Mettre à jour les objectifs affichés
    const stepLabel = document.querySelector('#fitness .steps-icon + .card-content .card-label');
    if (stepLabel) {
        stepLabel.textContent = 'Objectif: ' + stepsGoal;
    }
    
    showNotification('Objectifs mis à jour avec succès');
}

// Afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Afficher avec animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer après délai
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utilitaire: Mettre la première lettre en majuscule
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Lancer l'initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);