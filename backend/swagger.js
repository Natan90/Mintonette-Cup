const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Mintonette Cup',
      version: '1.0.0',
      description: "Documentation de l'API pour la Mintonette Cup",
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local de développement',
      },
    ],
    components: {
      schemas: {
        // Schéma utilisateur
        User: {
          type: 'object',
          required: ['nom', 'prenom', 'login', 'mdp', 'mail', 'date_naissance', 'sexe'],
          properties: {
            id: { type: 'integer', description: 'ID auto-généré' },
            nom: { type: 'string', description: 'Nom de l’utilisateur' },
            prenom: { type: 'string', description: 'Prénom de l’utilisateur' },
            login: { type: 'string', description: "Login de l’utilisateur" },
            mail: { type: 'string', description: 'Email de l’utilisateur' },
            date_naissance: { type: 'string', format: 'date', description: 'Date de naissance' },
            sexe: { type: 'string', enum: ['H', 'F'], description: 'Sexe' },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Utilisateur créé avec succès' },
            user: {
              type: 'object',
              properties: { id: { type: 'integer' } },
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Connexion réussie' },
            token: { type: 'string', description: 'Token de session' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                login: { type: 'string' },
                nom: { type: 'string' },
                prenom: { type: 'string' },
              },
            },
            expiresAt: { type: 'string', description: 'Date d’expiration du token' },
          },
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string', description: 'Message d’erreur' } },
        },
      },
    },
  },
  apis: [path.join(__dirname, './routes/utilisateurs/*.js')], // Analyse tous les fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
