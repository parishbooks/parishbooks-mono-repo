import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | undefined;

const metricExportIntervalMillis = () => {
    const fromEnv = process.env.OTEL_METRIC_EXPORT_INTERVAL;
    if (fromEnv === undefined) return 15_000;
    const parsed = Number(fromEnv);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 15_000;
};

const otlpLogsEndpoint = (): string => {
    if (process.env.OTEL_LOGS_ENDPOINT) return process.env.OTEL_LOGS_ENDPOINT;
    if (process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT) return process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT;
    const base = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.replace(/\/$/, '');
    if (base) return `${base}/v1/logs`;
    return 'http://localhost:4318/v1/logs';
};

export const isOtelLoggingEnabled = (): boolean => process.env.OTEL_SDK_DISABLED !== 'true' && process.env.OTEL_LOGS_EXPORTER !== 'none';

export const startNodeTelemetry = (): NodeSDK | undefined => {
    if (process.env.OTEL_SDK_DISABLED === 'true') return undefined;
    if (sdk) return sdk;

    sdk = new NodeSDK({
        resource: resourceFromAttributes({
            [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'parishbooks-svc',
            'service.version': process.env.npm_package_version ?? process.env.OTEL_SERVICE_VERSION ?? '0.0.0',
            'deployment.environment.name': process.env.NODE_ENV ?? 'development',
        }),
        traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_TRACES_ENDPOINT ?? 'http://localhost:4318/v1/traces' }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({ url: process.env.OTEL_METRICS_ENDPOINT ?? 'http://localhost:4318/v1/metrics' }),
            exportIntervalMillis: metricExportIntervalMillis(),
        }),
        logRecordProcessors: isOtelLoggingEnabled() ? [new BatchLogRecordProcessor({ exporter: new OTLPLogExporter({ url: otlpLogsEndpoint() }) })] : undefined,
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-fs': { enabled: false },
                '@opentelemetry/instrumentation-dns': { enabled: false },
                '@opentelemetry/instrumentation-http': {
                    enabled: true,
                    ignoreIncomingRequestHook: (req) => {
                        return req.url?.includes('/health') || req.url?.includes('/metrics') || false;
                    },
                },
            }),
        ],
    });

    sdk.start();
    return sdk;
};

export const shutdownNodeTelemetry = async (): Promise<void> => {
    if (!sdk) return;
    const active = sdk;
    sdk = undefined;
    await active.shutdown();
};
