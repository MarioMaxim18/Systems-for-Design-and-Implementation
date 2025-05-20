import { monitorLogs } from '../utils/monitorLogs.js';

class BackgroundMonitor {
  constructor(interval = 10 * 1000) {
    this.interval = interval;
    this.isRunning = false;
    this.timer = null;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.runMonitor();
    
    this.timer = setInterval(() => {
      this.runMonitor();
    }, this.interval);
  }

  async runMonitor() {
    try {
      await monitorLogs();
    } catch (error) {
      console.error('Error in background monitor:', error);
    }
  }

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
  }
}

const backgroundMonitor = new BackgroundMonitor();

export default backgroundMonitor;