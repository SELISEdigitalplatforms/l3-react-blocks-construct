import { LogRecordProcessor, SdkLogRecord } from '@opentelemetry/sdk-logs';
import { ILog } from '../index.type';
import { Processor } from './processor';

export class LogProcessor extends Processor<ILog> implements LogRecordProcessor {
  private serviceId: string;
  private url: string;

  constructor(serviceId: string, url: string) {
    super();
    this.serviceId = serviceId;
    this.url = url;
  }

  protected async send(data: ILog[]): Promise<boolean> {
    const body = {
      serviceName: this.serviceId,
      logs: data,
    };

    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  forceFlush(): Promise<void> {
    return this.flush();
  }
  onEmit(logRecord: SdkLogRecord): void {
    const log: ILog = {
      timestamp: new Date().toISOString(),
      level: logRecord.attributes.level?.toString() || 'Information',
      message: logRecord.attributes.message?.toString() ?? '',
      exception: logRecord.attributes?.exception?.toString() ?? '',
      serviceName: logRecord.attributes.serviceId?.toString() || 'unknown-service',
      tenantId: logRecord.attributes.tenantId?.toString() || 'unknown-tenant',
    };
    this.queue.push(log);
  }
}
