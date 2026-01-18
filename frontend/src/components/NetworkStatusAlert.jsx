// src/components/NetworkStatusAlert.js
import React, { useEffect, useState } from 'react';

function NetworkStatusAlert() {
  const [_, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      alert("You are back online!");
    };

    const handleOffline = () => {
      setIsOnline(false);
      alert("You are offline. Check your internet connection.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
    </div>
  );
}

export default NetworkStatusAlert;
