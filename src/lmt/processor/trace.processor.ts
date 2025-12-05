import { ReadableSpan, SpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Processor } from './processor';
import { ITrace } from '../index.type';

export class TraceProcessor extends Processor<ITrace> implements SpanProcessor {
  private serviceId: string;
  private tenantId: string;
  private url: string;
  constructor(serviceId: string, tenantId: string, url: string) {
    super();
    this.serviceId = serviceId;
    this.tenantId = tenantId;
    this.url = url;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onStart(_span: ReadableSpan): void {}

  onEnd(span: ReadableSpan): void {
    const trace: ITrace = {
      traceId: span.spanContext().traceId,
      spanId: span.spanContext().spanId,
      parentSpanId: span.parentSpanContext?.spanId || '',
      parentId: span.parentSpanContext?.spanId || '',
      kind: span.kind.toString(),
      activitySourceName: this.serviceId,
      operationName: span.name,
      timestamp: new Date(this.hrTimeToMS(span.endTime)).toISOString(),
      startTime: new Date(this.hrTimeToMS(span.startTime)).toISOString(),
      endTime: new Date(this.hrTimeToMS(span.endTime)).toISOString(),
      duration: this.hrTimeToMS(span.duration),
      attributes: span.attributes as Record<string, string>,
      status: span.status.code.toString(),
      statusDescription: '',
      baggage: {},
      serviceName: this.serviceId,
      tenantId: this.tenantId,
    };
    this.queue.push(trace);
  }

  protected async send(data: ITrace[]): Promise<boolean> {
    const body = {
      serviceName: this.serviceId,
      traces: data,
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
    return Promise.resolve();
  }
}
