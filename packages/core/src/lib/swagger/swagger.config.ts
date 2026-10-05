import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export type SwaggerCookieAuth = {
    name: string;
    cookieName: string;
};

export type SwaggerTag = {
    name: string;
    description?: string;
};

export type DefineSwaggerProps = {
    title: string;
    description?: string;
    version?: string;
    path?: string;
    jsonDocumentUrl?: string;
    yamlDocumentUrl?: string;
    tags?: SwaggerTag[];
    cookieAuth?: SwaggerCookieAuth[];
};

export const setupSwagger = (app: INestApplication, props: DefineSwaggerProps): void => {
    const path = props.path ?? 'api/docs';
    const builder = new DocumentBuilder()
        .setTitle(props.title)
        .setDescription(props.description ?? '')
        .setVersion(props.version ?? '1');

    for (const tag of props.tags ?? []) builder.addTag(tag.name, tag.description);
    for (const auth of props.cookieAuth ?? []) {
        builder.addCookieAuth(auth.name, { type: 'apiKey', in: 'cookie', name: auth.cookieName }, auth.name);
    }

    const document = SwaggerModule.createDocument(app, builder.build(), {
        operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    });

    SwaggerModule.setup(path, app, document, {
        jsonDocumentUrl: props.jsonDocumentUrl ?? `${path}-json`,
        yamlDocumentUrl: props.yamlDocumentUrl ?? `${path}-yaml`,
        swaggerOptions: { persistAuthorization: true },
    });
};
