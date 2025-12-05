export abstract class Processor<T> {
  protected queue: T[] = [];
  private flushInterval: number;
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(flushInterval = 10000) {
    this.flushInterval = flushInterval;
    this.startTimer();
  }

  private startTimer() {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  protected hrTimeToMS(hrtime: [number, number]) {
    const [seconds, nanoseconds] = hrtime;
    return seconds * 1000 + nanoseconds / 1_000_000;
  }

  // 🔵 Must be implemented by child
  protected abstract send(data: T[]): Promise<boolean>;

  async flush() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const items = [...this.queue];
    this.queue = [];

    const success = await this.send(items);

    // Retry by pushing back
    if (!success) {
      this.queue.unshift(...items);
    }

    this.isProcessing = false;
  }

  shutdown(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    return this.flush();
  }
}
