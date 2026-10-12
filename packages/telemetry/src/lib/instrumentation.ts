import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        'service.name': 'parishbooks-svc',
        'service.version': '1.0.0',
        'deployment.environment.name': process.env.NODE_ENV ?? 'development',
    }),
    traceExporter: new OTLPTraceExporter({ url: 'http://localhost:4318/v1/traces' }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({ url: 'http://localhost:4318/v1/metrics' }),
        exportIntervalMillis: 15000,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

const shutdown = async () => {
    await sdk.shutdown();
};

process.once('SIGTERM', () => {
    void shutdown();
});

process.once('SIGINT', () => {
    void shutdown();
});
