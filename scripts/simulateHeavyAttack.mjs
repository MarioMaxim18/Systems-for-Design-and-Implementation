import mongoose from 'mongoose';
import dbConnect from '../src/lib/dbConnect.js';
import Language from '../src/models/Language.js';
import Log from '../src/models/Log.js';
import { monitorLogs } from '../src/utils/monitorLogs.js';

await dbConnect();

const attackerId = '6817863f1d0d27dc38cd5289'; // real userId

async function logAction(userId, action) {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return;
  try {
    await Log.create({ userId, action });
  } catch (err) {
    console.error("❌ Failed to log action:", err);
  }
}

async function simulateHeavyAttack() {
  console.log('🚨 Simulating heavy suspicious user activity...');
  const inserted = [];

  for (let i = 0; i < 20; i++) {
    const lang = await Language.create({
      name: `ExploitLang${i}`,
      developer: 'test',
      year: 2025,
      description: 'test',
      createdBy: attackerId,
    });
    inserted.push(lang);
    await logAction(attackerId, 'CREATE');
  }

  await monitorLogs({ timeWindowMs: 60 * 1000, actionThreshold: 5 });

  console.log('🛡️ Monitoring complete.');
  process.exit();
}

simulateHeavyAttack();