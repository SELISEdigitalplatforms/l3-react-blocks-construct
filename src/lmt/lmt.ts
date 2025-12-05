import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { LoggerProvider } from '@opentelemetry/sdk-logs';
import { LogProcessor } from './processor/log.processor';
import { TraceProcessor } from './processor/trace.processor';
import { Tracer } from '@opentelemetry/api';

export class LMT {
  private config: { serviceId: string; X_BLOCKS_KEY: string; baseUrl: string };
  private traceProvider: WebTracerProvider | null = null;
  private loggerProvider: LoggerProvider | null = null;
  public logger: {
    info: (message: string) => void;
    error: (message: string) => void;
    warn: (message: string) => void;
  };
  public tracer: Tracer | null = null;
  private urls: { trace: string; log: string } = {
    trace: '',
    log: '',
  };
  constructor(config: { serviceId: string; X_BLOCKS_KEY: string; baseUrl: string }) {
    this.config = config;
    this.urls.trace = `${this.config.baseUrl}/lmt-client/v1/Lmt/SendTraces`;
    this.urls.log = `${this.config.baseUrl}/lmt-client/v1/Lmt/SendLogs`;
    this.logger = this.createLogger();
    this.initialize();
  }
  private createLogger() {
    return {
      info: (message: string) => this.registerLog('Information', message),
      warn: (message: string) => this.registerLog('Warning', message),
      error: (message: string) => this.registerLog('Error', message),
    };
  }
  private initialize = () => {
    this.traceProvider = new WebTracerProvider({
      spanProcessors: [
        new TraceProcessor(this.config.serviceId, this.config.X_BLOCKS_KEY, this.urls.trace),
      ],
    });
    this.traceProvider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-document-load': { enabled: false },
          '@opentelemetry/instrumentation-user-interaction': { enabled: false },
          '@opentelemetry/instrumentation-fetch': {
            enabled: true,
            ignoreUrls: [this.urls.trace, this.urls.log],
          },
          '@opentelemetry/instrumentation-xml-http-request': {
            enabled: true,
            ignoreUrls: [this.urls.trace, this.urls.log],
          },
        }),
      ],
    });
    this.tracer = this.traceProvider.getTracer('manual-tracer-web');
    this.loggerProvider = new LoggerProvider({
      processors: [new LogProcessor(this.config.serviceId, this.urls.log)],
    });
  };

  private registerLog = (level: string, message: string) => {
    if (this.loggerProvider) {
      const _logger = this.loggerProvider.getLogger('default');
      _logger.emit({
        severityText: level.toUpperCase(),
        body: message,
        attributes: {
          serviceId: this.config.serviceId,
          tenantId: this.config.X_BLOCKS_KEY,
          message: message,
          level: level,
        },
      });
    }
  };

  shutdown() {
    if (this.traceProvider) {
      this.traceProvider.forceFlush().then(() => this.traceProvider?.shutdown());
      this.traceProvider = null;
    }
    if (this.loggerProvider) {
      this.loggerProvider.forceFlush().then(() => this.loggerProvider?.shutdown());
      this.loggerProvider = null;
    }
    // console.log('OpenTelemetry shutdown completed');
  }
}
