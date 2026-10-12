import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
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

export const startNodeTelemetry = (): NodeSDK | undefined => {
    if (process.env.OTEL_SDK_DISABLED === 'true') return undefined;
    if (sdk) return sdk;

    sdk = new NodeSDK({
        resource: resourceFromAttributes({
            [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'parishbooks-svc',
            'service.version': process.env.npm_package_version ?? process.env.OTEL_SERVICE_VERSION ?? '0.0.0',
            'deployment.environment.name': process.env.NODE_ENV ?? 'development',
        }),
        traceExporter: new OTLPTraceExporter(),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter(),
            exportIntervalMillis: metricExportIntervalMillis(),
        }),
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-fs': { enabled: false },
                '@opentelemetry/instrumentation-dns': { enabled: false },
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
