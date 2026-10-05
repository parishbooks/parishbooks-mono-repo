import { AsyncLocalStorage } from 'node:async_hooks';

export type CorrelationStore = {
    correlationId: string;
};

export const correlationStorage = new AsyncLocalStorage<CorrelationStore>();

export const getCorrelationId = (): string | undefined => correlationStorage.getStore()?.correlationId;
