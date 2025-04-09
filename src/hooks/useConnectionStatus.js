"use client";
import { useEffect, useState } from "react";

export function useConnectionStatus(pingUrl = "/api/languages", interval = 3000) {
  const [isOnline, setIsOnline] = useState(true);
  const [serverUp, setServerUp] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();

    const pingServer = async () => {
      try {
        const res = await fetch(pingUrl, { method: "HEAD" });
        setServerUp(res.ok);
      } catch {
        setServerUp(false);
      }
    };

    const id = setInterval(pingServer, interval);
    pingServer();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      clearInterval(id);
    };
  }, [pingUrl, interval]);

  return { isOnline, serverUp };
}
