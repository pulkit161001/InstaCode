import React,{ useEffect, useState } from "react";

export const AnimatedNumber = ({ target, duration = 2000 }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    let startTime = null;
    const incrementNumber = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const newNumber = Math.min(
        Math.floor((progress / duration) * target),
        target
      );
      setCurrentNumber(newNumber);

      if (progress < duration) {
        requestAnimationFrame(incrementNumber);
      }
    };
    requestAnimationFrame(incrementNumber);
  }, [target, duration]);

  return <span className="font-bold">{currentNumber}</span>;
};
