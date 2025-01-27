import { Express, Response, Request } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';
import servers from "./servers.json";
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Working Time Record API',
      version,
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: ['./src/interfaces/routes/*.ts', './src/infrastructure/database/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default (app: Express) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get('/docs.json', (req: Request, res: Response): Response => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(swaggerSpec);
  });

  console.info(`Swagger docs available at http://localhost:${port}/api-docs`);
};