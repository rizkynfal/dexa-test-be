import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_CONFIG } from '../config';
const configApp = APP_CONFIG;
export const SwaggerSetup = (app: INestApplication): void => {
  const appName = configApp.NAME;
  const options = new DocumentBuilder()
    .setTitle(`API DOCUMENTATION ${appName}`)
    .setDescription(
      `This API documentation is generated using Swagger OpenAPI.</br>
      To download the API specification in JSON format, click <a href="${configApp.URL}/swagger.json">here</a>.</br>
      To download the API specification in YAML format, click <a href="${configApp.URL}/swagger.yaml">here</a>.</br>
      `,
    )
    .setVersion('1.0')
    .addServer('/user', 'Via API Gateway')
    .addBearerAuth(
      {
        description: 'Default',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'azure',
    )
    .addGlobalResponse(
      {
        status: 500,
        description: 'Internal Server Error',
      },
      {
        status: 200,
        description: 'Ok',
      },
      {
        status: 201,
        description: 'Created',
      },
      {
        status: 400,
        description: 'Bad Request',
      },
      {
        status: 403,
        description: 'Forbidden',
      },
    )
    .build();
  const document = () =>
    SwaggerModule.createDocument(app, options, { deepScanRoutes: true });
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showCommonExtensions: true,
      showRequestDuration: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    urls: [
      { url: 'docs/swagger.json', name: 'Main API' },
      { url: 'docs/schedules/swagger.json', name: 'Schedules Module' },
    ],
    jsonDocumentUrl: 'docs/swagger.json',
    customSiteTitle: `${appName} API Documentation`,
  });
};
