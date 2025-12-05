export interface ILog {
  timestamp: string;
  level: string;
  message: string;
  exception: string;
  serviceName: string;
  tenantId: string;
  properties?: Record<string, string>;
}

export interface ITrace {
  timestamp: string;
  traceId: string;
  spanId: string;
  parentSpanId: string;
  parentId: string;
  kind: string;
  activitySourceName: string;
  operationName: string;
  startTime: string;
  endTime: string;
  duration: number;
  attributes: Record<string, string>;
  status: string;
  statusDescription: string;
  baggage: Record<string, string>;
  serviceName: string;
  tenantId: string;
}
