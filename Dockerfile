# Utilisation d'une image Node.js légère
FROM node:18-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Exposer le port utilisé par NestJS
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start"]