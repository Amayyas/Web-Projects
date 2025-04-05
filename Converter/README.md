# Convertisseur de Devises

Une application web moderne permettant de convertir facilement entre différentes devises mondiales, développée en HTML, CSS et JavaScript.

## Fonctionnalités

- **Conversion en temps réel** - Taux de change actualisés à partir d'une API externe
- **Support de multiples devises** - Plus de 20 devises majeures disponibles
- **Graphique d'historique des taux** - Visualisation de l'évolution des taux sur 7 jours
- **Thème clair/sombre** - Interface adaptable à vos préférences visuelles
- **Design responsive** - S'adapte parfaitement à tous les appareils
- **Interface intuitive** - Simple et facile à utiliser
- **Animation fluide** - Pour une expérience utilisateur agréable
- **Persistance des préférences** - Sauvegarde du thème choisi

## Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Mise en page et style avec variables CSS pour le theming
- **JavaScript (ES6+)** - Logique d'application et manipulation du DOM
- **Fetch API** - Pour récupérer les données des taux de change
- **Chart.js** - Pour afficher les graphiques d'historique des taux
- **LocalStorage** - Sauvegarde des préférences utilisateur
- **Font Awesome** - Icônes pour une interface utilisateur intuitive
- **Exchange Rate API** - Fournisseur de données de taux de change

## Installation et utilisation

1. Clonez ce dépôt :
```bash
git clone git@github.com:Amayyas/Web-Projects.git
```

2. Ouvrez le dossier du projet :
```bash
cd Web-Projects/Converter
```

3. Vous pouvez soit :
   - Ouvrir directement le fichier `index.html` dans votre navigateur préféré
   - Utiliser Python pour lancer un serveur web local :
   ```bash
   python3 -m http.server 8000
   ```
   Puis accéder à l'application via `http://localhost:8000` dans votre navigateur

## Structure du projet

```
Converter/
├── index.html        # Structure HTML principale
├── css/
│   └── style.css     # Styles et thèmes (clair/sombre)
├── js/
│   └── script.js     # Logique de l'application
└── README.md         # Documentation du projet
```

## Fonctionnement

1. Entrez le montant que vous souhaitez convertir
2. Sélectionnez la devise d'origine dans le menu déroulant "De"
3. Sélectionnez la devise cible dans le menu déroulant "À"
4. Cliquez sur le bouton "Convertir" pour effectuer la conversion
5. Utilisez le bouton d'échange (flèches) pour inverser les devises
6. Consultez le graphique d'historique des taux pour suivre l'évolution
7. Cliquez sur le bouton lune/soleil pour basculer entre les thèmes clair et sombre

## API utilisée

Cette application utilise l'API gratuite [Exchange Rate API](https://www.exchangerate-api.com/) pour récupérer les taux de change en temps réel. Pour les données historiques, le projet utilise actuellement des données simulées, mais peut être facilement adapté pour utiliser une API d'historique.

## Personnalisation

Vous pouvez facilement personnaliser cette application en modifiant les variables CSS dans le fichier `css/style.css`. Les couleurs du thème clair et sombre peuvent être ajustées selon vos préférences.

```css
:root {
    --primary-color: #4c6ef5; /* Couleur principale */
    --secondary-color: #364fc7; /* Couleur secondaire */
    /* ... autres variables ... */
}

[data-theme="dark"] {
    --primary-color: #63b3ed; /* Couleur principale en mode sombre */
    --secondary-color: #4299e1; /* Couleur secondaire en mode sombre */
    /* ... autres variables ... */
}
```

Pour utiliser une API différente ou ajouter une clé API, modifiez les constantes suivantes dans `script.js` :

```javascript
const API_KEY = 'votre_clé_api'; 
const API_URL = 'https://open.er-api.com/v6/latest/';
```

---

Développé avec ❤️ par Amayyas