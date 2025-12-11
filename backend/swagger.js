const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Mintonette Cup",
      version: "1.0.0",
      description: "Documentation de l'API pour la Mintonette Cup",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local de développement",
      },
    ],
    components: {
      schemas: {
        // ===== Utilisateur =====
        User: {
          type: "object",
          required: [
            "nom",
            "prenom",
            "login",
            "mdp",
            "mail",
            "tel_utilisateur",
            "sexe",
          ],
          properties: {
            id: { type: "integer", description: "ID auto-généré" },
            nom: { type: "string", description: "Nom de l’utilisateur" },
            prenom: { type: "string", description: "Prénom de l’utilisateur" },
            login: { type: "string", description: "Login de l’utilisateur" },
            mdp: { type: "string", description: "Mot de passe" },
            mail: { type: "string", description: "Email de l’utilisateur" },
            tel_utilisateur: { 
              type: "string", 
              pattern: "^[0-9+\\-() ]{6,20}$", 
              description: "Numéro de téléphone",
              example: "+33 6 12 34 56 78"
            },
            sexe: { type: "string", enum: ["H", "F"], description: "Sexe de l’utilisateur" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Utilisateur créé avec succès" },
            user: { type: "object", properties: { id: { type: "integer" } } },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Connexion réussie" },
            token: { type: "string", description: "Token de session" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                login: { type: "string" },
                nom: { type: "string" },
                prenom: { type: "string" },
              },
            },
            expiresAt: { type: "string", description: "Date d’expiration du token" },
          },
        },

        // ===== Administrateur =====
        Admin: {
          type: "object",
          required: ["login", "mdp"],
          properties: {
            id: { type: "integer", description: "ID admin" },
            login: { type: "string", description: "Login administrateur" },
            mdp: { type: "string", description: "Mot de passe" },
          },
        },
        AdminResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Connexion admin réussie" },
            token: { type: "string", description: "Token admin" },
            admin: { $ref: "#/components/schemas/Admin" },
          },
        },

        // ===== Prestataire =====
        Prestataire: {
          type: "object",
          required: ["nom_prestataire", "type_prestataire_id"],
          properties: {
            id_prestataire: { type: "integer", description: "ID du prestataire" },
            nom_prestataire: { type: "string", description: "Nom du prestataire" },
            description_prestataire: { type: "string", description: "Description" },
            type_prestataire_id: { type: "integer", description: "ID du type de prestataire" },
          },
        },
        TypePrestataire: {
          type: "object",
          required: ["nom_type_prestataire"],
          properties: {
            id_type_prestataire: { type: "integer", description: "ID du type de prestataire" },
            nom_type_prestataire: { type: "string", description: "Nom du type" },
          },
        },
        PrestataireTypesResponse: {
          type: "object",
          properties: {
            animations: { type: "array", items: { type: "object", properties: { id_type_animation: { type: "integer" }, nom_type_animation: { type: "string" } } } },
            restaurations: { type: "array", items: { type: "object", properties: { id_type_restauration: { type: "integer" }, nom_type_restauration: { type: "string" } } } },
            boutiques: { type: "array", items: { type: "object", properties: { id_type_boutique: { type: "integer" }, nom_type_boutique: { type: "string" } } } },
          },
        },

        // ===== Erreurs =====
        Error: {
          type: "object",
          properties: { error: { type: "string", description: "Message d’erreur" } },
        },
      },
    },
  },
  apis: [path.join(__dirname, "./routes/**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
