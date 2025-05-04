import { monitorLogs } from '../utils/monitorLogs.js';

let monitorInterval = null;
const DEFAULT_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function startMonitorJob(interval = DEFAULT_INTERVAL) {
  if (monitorInterval) {
    clearInterval(monitorInterval);
  }
  
  runMonitorCheck();
  
  monitorInterval = setInterval(runMonitorCheck, interval);
  
  console.log(`🔍 Started user activity monitoring job (interval: ${interval/1000}s)`);
  
  return monitorInterval;
}

export function stopMonitorJob() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    console.log('✋ Stopped user activity monitoring job');
    return true;
  }
  return false;
}

async function runMonitorCheck() {
  try {
    console.log(`🔎 Running user activity monitoring check at ${new Date().toISOString()}`);
    const result = await monitorLogs();
    
    if (result.suspiciousUsersCount > 0) {
      console.log(`🚨 Found ${result.suspiciousUsersCount} suspicious users`);
    } else {
      console.log('✅ No suspicious activity detected');
    }
  } catch (error) {
    console.error('❌ Error in monitor job:', error);
  }
}