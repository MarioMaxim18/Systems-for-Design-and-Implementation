import 'dotenv/config';
import backgroundMonitor from './lib/backgroundMonitor.js';

console.log("🚀 Background monitor runner started");
backgroundMonitor.start();