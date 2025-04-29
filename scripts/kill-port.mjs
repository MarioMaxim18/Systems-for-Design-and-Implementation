import { execSync } from "child_process";

const portsToKill = [3000, 4000];

for (const port of portsToKill) {
  try {
    const pid = execSync(`lsof -ti:${port}`).toString().trim();
    if (pid) {
      execSync(`kill -9 ${pid}`);
      console.log(`Killed process on port ${port} (PID ${pid})`);

      await new Promise((res) => setTimeout(res, 1000));
    } else {
      console.log(`Port ${port} is already free`);
    }
  } catch {
    console.log(`Port ${port} is already free`);
  }
}