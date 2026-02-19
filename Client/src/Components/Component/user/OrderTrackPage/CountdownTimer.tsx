import React, { useEffect, useState } from "react";

interface Props {
  timeRemaining: { hours: number; minutes: number; seconds: number };
}

const CountdownTimer: React.FC<Props> = ({ timeRemaining }) => {
  const [time, setTime] = useState(timeRemaining);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;

        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(interval);
          return prev;
        }

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8">
      <h4 className="text-base font-bold text-gray-900 mb-4">
        Estimated time until ready
      </h4>

      <div className="flex gap-4 mb-6">
        {["hours", "minutes", "seconds"].map((unit) => (
          <div
            key={unit}
            className="flex-1 bg-gray-100 rounded-lg p-4 text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {String(time[unit as keyof typeof time]).padStart(2, "0")}
            </div>

            <div className="text-sm text-gray-600">
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
