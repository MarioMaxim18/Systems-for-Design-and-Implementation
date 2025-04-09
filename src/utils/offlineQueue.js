let queue = [];

function saveQueue() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("offlineQueue", JSON.stringify(queue));
  }
}

function loadQueue() {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("offlineQueue");
    queue = stored ? JSON.parse(stored) : [];
  }
}

loadQueue();

export function addToQueue(op) {
  queue.push(op);
  saveQueue();
}

export async function syncQueue(onComplete) {
  while (queue.length > 0) {
    const op = queue[0];

    try {
      if (op.type === "DELETE") {
        const res = await fetch(`/api/languages?id=${op.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      }

      if (op.type === "UPDATE") {
        const res = await fetch(`/api/languages?id=${op.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.data),
        });
        if (!res.ok) throw new Error();
      }

      if (op.type === "CREATE") {
        const res = await fetch(`/api/languages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.data),
        });
        if (!res.ok) throw new Error();
      }

      queue.shift();
      saveQueue();
    } catch {
      break;
    }
  }

  if (onComplete) onComplete();
}
