import { config } from 'dotenv';
import { resolve } from 'node:path';

export class E2eEnvironment {
    private static envLoaded = false;

    static loadEnv(): void {
        if (this.envLoaded) return;
        config({ path: resolve(import.meta.dirname, '../../../../.env') });
        this.envLoaded = true;
    }

    static get host(): string {
        return process.env.HOST ?? 'localhost';
    }

    static get port(): string {
        return process.env.APP_SVC_PORT ?? process.env.PORT ?? '8000';
    }

    static get portNumber(): number {
        return Number(this.port);
    }

    static get serverUrl(): string {
        return `http://${this.host}:${this.port}`;
    }
}
