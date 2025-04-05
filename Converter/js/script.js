// Sélection des éléments du DOM
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertButton = document.getElementById('convert-button');
const swapButton = document.getElementById('swap-button');
const conversionRateElement = document.getElementById('conversion-rate');
const baseAmountElement = document.getElementById('base-amount');
const targetAmountElement = document.getElementById('target-amount');
const lastUpdateElement = document.getElementById('last-update');
const themeToggle = document.getElementById('theme-toggle');

// API pour les taux de change (utilisation de l'API Exchange Rate Data)
const API_KEY = 'votre_clé_api'; // Obtenez une clé API gratuite sur https://exchangeratesapi.io/
const API_URL = 'https://open.er-api.com/v6/latest/'; // API gratuite sans clé API avec limitations

// Liste des devises principales (codes ISO 4217)
const CURRENCIES = {
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    USD: { code: 'USD', name: 'Dollar américain', symbol: '$', flag: '🇺🇸' },
    GBP: { code: 'GBP', name: 'Livre sterling', symbol: '£', flag: '🇬🇧' },
    JPY: { code: 'JPY', name: 'Yen japonais', symbol: '¥', flag: '🇯🇵' },
    CAD: { code: 'CAD', name: 'Dollar canadien', symbol: 'C$', flag: '🇨🇦' },
    AUD: { code: 'AUD', name: 'Dollar australien', symbol: 'A$', flag: '🇦🇺' },
    CHF: { code: 'CHF', name: 'Franc suisse', symbol: 'CHF', flag: '🇨🇭' },
    CNY: { code: 'CNY', name: 'Yuan chinois', symbol: '¥', flag: '🇨🇳' },
    SEK: { code: 'SEK', name: 'Couronne suédoise', symbol: 'kr', flag: '🇸🇪' },
    NZD: { code: 'NZD', name: 'Dollar néo-zélandais', symbol: 'NZ$', flag: '🇳🇿' },
    INR: { code: 'INR', name: 'Roupie indienne', symbol: '₹', flag: '🇮🇳' },
    BRL: { code: 'BRL', name: 'Real brésilien', symbol: 'R$', flag: '🇧🇷' },
    ZAR: { code: 'ZAR', name: 'Rand sud-africain', symbol: 'R', flag: '🇿🇦' },
    RUB: { code: 'RUB', name: 'Rouble russe', symbol: '₽', flag: '🇷🇺' },
    MXN: { code: 'MXN', name: 'Peso mexicain', symbol: '$', flag: '🇲🇽' },
    SGD: { code: 'SGD', name: 'Dollar de Singapour', symbol: 'S$', flag: '🇸🇬' },
    AED: { code: 'AED', name: 'Dirham des Émirats arabes unis', symbol: 'د.إ', flag: '🇦🇪' },
    MAD: { code: 'MAD', name: 'Dirham marocain', symbol: 'د.م.', flag: '🇲🇦' },
    TND: { code: 'TND', name: 'Dinar tunisien', symbol: 'د.ت', flag: '🇹🇳' },
    DZD: { code: 'DZD', name: 'Dinar algérien', symbol: 'د.ج', flag: '🇩🇿' }
};

// État initial
let currentRates = {};
let chartInstance = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialisation de l'application
function init() {
    // Remplir les sélecteurs de devises
    populateCurrencySelectors();
    
    // Définir les valeurs par défaut
    fromCurrencySelect.value = 'EUR';
    toCurrencySelect.value = 'USD';
    
    // Afficher l'heure de la dernière mise à jour
    updateLastUpdateTime();
    
    // Récupérer les taux de change
    fetchExchangeRates('EUR');
    
    // Ajouter des écouteurs d'événements
    convertButton.addEventListener('click', handleConversion);
    swapButton.addEventListener('click', swapCurrencies);
    fromCurrencySelect.addEventListener('change', () => fetchExchangeRates(fromCurrencySelect.value));
    amountInput.addEventListener('input', validateAmount);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Initialiser le thème
    setTheme(currentTheme);
}

// Remplir les sélecteurs de devises
function populateCurrencySelectors() {
    const currencyCodes = Object.keys(CURRENCIES);
    
    currencyCodes.forEach(code => {
        const currency = CURRENCIES[code];
        const option = createCurrencyOption(currency);
        const optionClone = option.cloneNode(true);
        
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(optionClone);
    });
}

// Créer une option pour le sélecteur de devises
function createCurrencyOption(currency) {
    const option = document.createElement('option');
    option.value = currency.code;
    option.textContent = `${currency.flag} ${currency.code} - ${currency.name}`;
    return option;
}

// Récupérer les taux de change
async function fetchExchangeRates(baseCurrency) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_URL}${baseCurrency}`);
        const data = await response.json();
        
        if (data && data.rates) {
            currentRates = data.rates;
            updateLastUpdateTime(data.time_last_updated);
            
            // Mettre à jour la conversion avec les nouveaux taux
            handleConversion();
            
            // Récupérer les données historiques pour le graphique
            fetchHistoricalData(baseCurrency, toCurrencySelect.value);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des taux de change:', error);
        alert('Impossible de récupérer les taux de change. Veuillez réessayer.');
    } finally {
        showLoading(false);
    }
}

// Gérer la conversion
function handleConversion() {
    const amount = parseFloat(amountInput.value) || 0;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (currentRates && currentRates[toCurrency]) {
        const rate = currentRates[toCurrency];
        const convertedAmount = amount * rate;
        
        // Formater les nombres pour l'affichage
        const formattedRate = formatCurrency(rate, toCurrency);
        const formattedConvertedAmount = formatCurrency(convertedAmount, toCurrency);
        const formattedBaseAmount = formatCurrency(amount, fromCurrency);
        
        // Mise à jour de l'interface
        conversionRateElement.textContent = `${formattedRate}`;
        baseAmountElement.textContent = `${formattedBaseAmount}`;
        targetAmountElement.textContent = `${formattedConvertedAmount}`;
    }
}

// Échanger les devises
function swapCurrencies() {
    const tempCurrency = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempCurrency;
    
    fetchExchangeRates(fromCurrencySelect.value);
}

// Valider le montant saisi
function validateAmount() {
    const value = amountInput.value;
    
    // Empêcher les valeurs négatives
    if (value < 0) {
        amountInput.value = 0;
    }
    
    // Mise à jour en temps réel
    handleConversion();
}

// Mettre à jour l'heure de la dernière mise à jour
function updateLastUpdateTime(timestamp) {
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    lastUpdateElement.textContent = date.toLocaleDateString('fr-FR', options);
}

// Formater les valeurs monétaires
function formatCurrency(value, currencyCode) {
    const currency = CURRENCIES[currencyCode] || { symbol: currencyCode };
    const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(value);
    
    return formatted;
}

// Récupérer les données historiques pour le graphique
async function fetchHistoricalData(baseCurrency, targetCurrency) {
    try {
        // Générer des dates pour les 7 derniers jours
        const dates = getLast7Days();
        
        // Dans une application réelle, vous pourriez utiliser une API d'historique 
        // comme https://exchangeratesapi.io/documentation/ (nécessite un abonnement)
        // Génération de fausses données pour la démonstration
        const historicalRates = generateMockHistoricalData(dates);
        
        // Mettre à jour le graphique
        updateChart(dates, historicalRates, baseCurrency, targetCurrency);
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données historiques:', error);
    }
}

// Générer des dates pour les 7 derniers jours
function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// Générer des données historiques fictives pour la démonstration
function generateMockHistoricalData(dates) {
    const baseValue = currentRates[toCurrencySelect.value] || 1;
    const variance = baseValue * 0.05; // 5% de variation max
    
    return dates.map(() => {
        // Générer une valeur aléatoire autour du taux actuel
        return baseValue + (Math.random() * 2 - 1) * variance;
    });
}

// Mettre à jour le graphique
function updateChart(dates, rates, baseCurrency, targetCurrency) {
    const ctx = document.getElementById('history-chart').getContext('2d');
    
    // Détruire le graphique existant s'il y en a un
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Créer un nouveau graphique
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${baseCurrency} vers ${targetCurrency}`,
                data: rates,
                backgroundColor: 'rgba(76, 110, 245, 0.2)',
                borderColor: 'rgba(76, 110, 245, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(76, 110, 245, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y, targetCurrency);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--light-gray')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                },
                y: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--light-gray')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                }
            }
        }
    });
}

// Afficher ou masquer l'indicateur de chargement
function showLoading(isLoading) {
    if (isLoading) {
        convertButton.textContent = 'Chargement...';
        convertButton.disabled = true;
    } else {
        convertButton.textContent = 'Convertir';
        convertButton.disabled = false;
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
    
    // Mettre à jour l'icône du bouton
    const themeIcon = themeToggle.querySelector('i');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Mettre à jour le graphique si disponible
    if (chartInstance) {
        chartInstance.options.scales.x.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--light-gray');
        chartInstance.options.scales.y.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--light-gray');
        chartInstance.options.scales.x.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        chartInstance.options.scales.y.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        chartInstance.options.plugins.legend.labels.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        chartInstance.update();
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', init);