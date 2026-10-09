import type { Params } from 'nestjs-pino';

export type DefineLoggerProps = {
    isProd: boolean;
    ignorePaths?: string[];
    level?: string;
};

export const defineLogger = ({ isProd, ignorePaths = ['/health'], level }: DefineLoggerProps): Params => ({
    pinoHttp: {
        level: level ?? (isProd ? 'info' : 'debug'),
        transport: isProd ? undefined : { target: 'pino-pretty', options: { singleLine: true, colorize: true } },
        autoLogging: { ignore: (req) => typeof req.url === 'string' && ignorePaths.some((path) => req.url?.includes(path)) },
        serializers: { req: (req) => ({ method: req.method, url: req.url }) },
    },
});
