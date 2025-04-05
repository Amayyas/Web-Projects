# To-Do List

Une application web de gestion de tâches moderne développée en HTML, CSS et JavaScript.

![To-Do List App]

## Fonctionnalités

- **Ajouter, modifier et supprimer des tâches** - Gérez facilement votre liste de tâches
- **Marquer les tâches comme terminées** - Suivez votre progression
- **Filtrage des tâches** - Filtrez par statut (toutes, à faire, terminées)
- **Compteur de tâches restantes** - Visualisez rapidement ce qu'il reste à faire
- **Suppression groupée** - Effacez toutes les tâches terminées en un clic
- **Thème clair/sombre** - Choisissez le mode qui convient à votre environnement
- **Persistance des données** - Vos tâches sont sauvegardées localement
- **Design responsive** - S'adapte à tous les appareils (ordinateurs, tablettes, smartphones)
- **Animations fluides** - Pour une expérience utilisateur agréable

## Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Mise en page et style avec variables CSS pour le theming
- **JavaScript (ES6+)** - Logique d'application et manipulation du DOM
- **LocalStorage** - Sauvegarde des tâches et des préférences utilisateur
- **Font Awesome** - Icônes pour une interface utilisateur intuitive

## Installation et utilisation

1. Clonez ce dépôt :
```bash
git clone git@github.com:Amayyas/Web-Projects.git
```

2. Ouvrez le dossier du projet :
```bash
cd Web_Projects/To-Do_List
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
To-Do_List/
├── index.html        # Structure HTML principale
├── css/
│   └── style.css     # Styles et thèmes (clair/sombre)
├── js/
│   └── script.js     # Logique de l'application
└── README.md         # Documentation du projet
```

## Fonctionnement

- Ajoutez une tâche en tapant dans le champ de saisie puis en appuyant sur Entrée ou en cliquant sur le bouton +
- Cliquez sur le cercle à côté d'une tâche pour la marquer comme terminée
- Utilisez les boutons de filtre pour afficher les tâches selon leur statut
- Cliquez sur l'icône d'édition pour modifier une tâche existante
- Cliquez sur l'icône de suppression pour retirer une tâche de la liste
- Cliquez sur le bouton lune/soleil pour basculer entre les thèmes clair et sombre

## Personnalisation

Vous pouvez facilement personnaliser cette application en modifiant les variables CSS dans le fichier `css/style.css`. Les couleurs du thème clair et sombre peuvent être ajustées selon vos préférences.

```css
:root {
    --primary-color: #3498db; /* Couleur principale */
    --secondary-color: #2980b9; /* Couleur secondaire */
    /* ... autres variables ... */
}

[data-theme="dark"] {
    --primary-color: #61dafb; /* Couleur principale en mode sombre */
    --secondary-color: #4cc2ef; /* Couleur secondaire en mode sombre */
    /* ... autres variables ... */
}
```

---

Développé avec ❤️ par Amayyas