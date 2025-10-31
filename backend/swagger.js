const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
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
};

const options = {
  definition: swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
