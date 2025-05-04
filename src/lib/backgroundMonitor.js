import { monitorLogs } from '../utils/monitorLogs.js';

class BackgroundMonitor {
  constructor(interval = 10 * 1000) { // ✅ Every 10 seconds
    this.interval = interval;
    this.isRunning = false;
    this.timer = null;
  }

  start() {
    if (this.isRunning) {
      console.log('Background monitor already running');
      return;
    }

    console.log('Starting background monitor service');
    this.isRunning = true;
    
    this.runMonitor();
    
    this.timer = setInterval(() => {
      this.runMonitor();
    }, this.interval);
  }

  async runMonitor() {
    try {
      console.log(`Running monitor check at ${new Date().toISOString()}`);
      await monitorLogs();
    } catch (error) {
      console.error('Error in background monitor:', error);
    }
  }

  stop() {
    if (!this.isRunning) {
      console.log('Background monitor is not running');
      return;
    }

    console.log('Stopping background monitor service');
    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
  }
}

const backgroundMonitor = new BackgroundMonitor();

export default backgroundMonitor;