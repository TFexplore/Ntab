import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="flex flex-col items-center text-white drop-shadow-lg select-none">
      <h1 className="text-[7rem] leading-none font-light tracking-tighter">
        {formatTime(time)}
      </h1>
      <div className="mt-2 text-lg font-medium tracking-wide opacity-90 uppercase">
        {formatDate(time)}
      </div>
    </div>
  );
};

export default Clock;