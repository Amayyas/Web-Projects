# Tableau de Bord Personnel

Un tableau de bord moderne pour agréger et visualiser vos données personnelles de fitness, finances et habitudes en un seul endroit.

![Tableau de Bord Personnel]

## Fonctionnalités

- **Vue d'ensemble** - Visualisez vos statistiques essentielles en un coup d'œil
- **Suivi fitness** - Suivez vos pas, calories brûlées et entraînements
- **Gestion des finances** - Surveillez vos revenus, dépenses et économies
- **Suivi des habitudes** - Développez et maintenez des habitudes positives
- **Tableau de bord personnalisable** - Adaptez l'interface à vos besoins
- **Visualisations interactives** - Graphiques et statistiques dynamiques
- **Thème clair/sombre** - Interface adaptée à vos préférences visuelles
- **Design responsive** - S'adapte parfaitement à tous les appareils
- **Connexion aux API externes** - Intégration avec vos applications préférées

## Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Design moderne avec variables CSS pour le theming
- **JavaScript (ES6+)** - Logique d'application et manipulation du DOM
- **Chart.js** - Création de graphiques interactifs
- **LocalStorage** - Sauvegarde des préférences utilisateur
- **Font Awesome** - Icônes pour une interface utilisateur intuitive

## Installation et utilisation

1. Clonez ce dépôt :
```bash
git clone git@github.com:Amayyas/Web-Projects.git
```

2. Ouvrez le dossier du projet :
```bash
cd Web-Projects/Dashboard
```

3. Vous pouvez soit :
   - Ouvrir directement le fichier `index.html` dans votre navigateur préféré
   - Utiliser Python pour lancer un serveur web local :
   ```bash
   python3 -m http.server 8000
   ```
   Puis accéder au tableau de bord via `http://localhost:8000` dans votre navigateur

## Structure du projet

```
Dashboard/
├── index.html        # Structure HTML principale
├── css/
│   └── style.css     # Styles et thèmes (clair/sombre)
├── js/
│   └── script.js     # Logique de l'application et gestion des données
└── README.md         # Documentation du projet
```

## Sections du tableau de bord

### Vue d'ensemble
La page d'accueil présente un résumé des métriques clés de toutes vos activités, avec des widgets pour visualiser votre activité hebdomadaire, la répartition de vos dépenses et vos tâches à faire.

### Fitness
Cette section vous permet de suivre votre activité physique, avec des détails sur :
- Nombre de pas quotidiens
- Calories brûlées
- Historique des entraînements
- Répartition des types d'activités
- Tendances mensuelles

### Finances
Gérez vos finances personnelles en visualisant :
- Revenus et dépenses
- Économies mensuelles
- Répartition des dépenses par catégorie
- Historique des transactions
- Tendances financières sur plusieurs mois

### Habitudes
Suivez et développez vos habitudes quotidiennes grâce à :
- Suivi visuel des habitudes
- Calendrier de progression (heatmap)
- Pourcentages de complétion
- Répartition journalière et hebdomadaire

### Paramètres
Personnalisez votre expérience :
- Configuration du profil
- Définition d'objectifs personnels
- Connexion à des applications externes
- Gestion des préférences d'affichage

## Fonctionnalités à venir

- Synchronisation cloud avec Firebase
- Fonctionnalités d'exportation de données (CSV, PDF)
- Ajout de widgets personnalisés par l'utilisateur
- Mode hors ligne amélioré avec IndexedDB
- Analyses prédictives basées sur les habitudes
- Notifications et rappels personnalisés
- Application mobile avec React Native

## Personnalisation

Vous pouvez facilement personnaliser ce tableau de bord en modifiant les variables CSS dans le fichier `css/style.css`. Les couleurs du thème clair et sombre peuvent être ajustées selon vos préférences.

```css
:root {
    --primary-color: #4361ee; /* Couleur principale */
    --secondary-color: #3f37c9; /* Couleur secondaire */
    /* ... autres variables ... */
}

[data-theme="dark"] {
    --primary-color: #7b68ee; /* Couleur principale en mode sombre */
    --secondary-color: #6a5acd; /* Couleur secondaire en mode sombre */
    /* ... autres variables ... */
}
```

Pour connecter le tableau de bord à vos propres sources de données, modifiez les fonctions API dans `script.js`.

---

Développé avec ❤️ par Amayyas