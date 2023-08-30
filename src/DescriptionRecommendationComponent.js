

// TimerComponent.js

import React, { useEffect, useState } from 'react';
import Timer from 'easytimer.js';

const TimerComponent = ({ status, onTimeChange }) => {
  const [timer] = useState(new Timer());

  useEffect(() => {
    if (status === 'started') {
      timer.start();
    } else {
      timer.stop();
    }

    timer.addEventListener('secondsUpdated', function () {
      onTimeChange(timer.getTimeValues().toString());
    });

    return () => {
      timer.stop();
    };
  }, [status, timer, onTimeChange]);

  return (
    <div>
      <span>{timer.getTimeValues().toString()}</span>
    </div>
  );
};

export default TimerComponent;




