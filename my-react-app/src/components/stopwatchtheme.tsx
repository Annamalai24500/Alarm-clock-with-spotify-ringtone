import React, { useState, useRef, useEffect } from "react";

function Stopwatchtheme() {
  const [startTime, setStartTime] = useState<null | number>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [now, setNow] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const savedState = localStorage.getItem('stopwatchState');
    if (savedState) {
      const { elapsedTime, startTime, isRunning } = JSON.parse(savedState);
      setElapsedTime(elapsedTime);
      if (isRunning && startTime) {
        const currentElapsed = Date.now() - startTime;
        setElapsedTime(currentElapsed);
        setStartTime(startTime);
        setNow(Date.now());
        intervalRef.current = setInterval(() => {
          setNow(Date.now());
        }, 100);
      }
    }
  }, []);
  useEffect(() => {
    const isRunning = intervalRef.current !== null;
    const stateToSave = {
      elapsedTime,
      startTime,
      isRunning,
      lastSaved: Date.now()
    };
    localStorage.setItem('stopwatchState', JSON.stringify(stateToSave));
  }, [elapsedTime, startTime]);
  function handleStart() {
    if (intervalRef.current) return;
    const newStartTime = Date.now() - elapsedTime;
    setStartTime(newStartTime);
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 100);
  }
  function handleStop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTime && now) {
      setElapsedTime(now - startTime);
    }
  }
  function handleReset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStartTime(null);
    setNow(null);
    setElapsedTime(0);
    localStorage.removeItem('stopwatchState');
  }
  let minutesPassed = 0;
  let secondsPassed = 0;
  let millisecondsPassed = 0;
  if (startTime != null && now != null) {
    const diff = now - startTime;
    millisecondsPassed = diff;
    secondsPassed = Math.floor(diff / 1000) % 60;
    minutesPassed = Math.floor(diff / 1000 / 60);
  } else if (elapsedTime > 0) {
    millisecondsPassed = elapsedTime;
    secondsPassed = Math.floor(elapsedTime / 1000) % 60;
    minutesPassed = Math.floor(elapsedTime / 1000 / 60);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-5xl font-mono text-green-400 drop-shadow-lg mb-6">
        {String(minutesPassed).padStart(2, "0")}:
        {String(secondsPassed).padStart(2, "0")}:
        {String(millisecondsPassed % 1000).padStart(3, "0")}
      </h1>
      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition shadow-md"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition shadow-md"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-xl bg-gray-600 hover:bg-gray-500 transition shadow-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Stopwatchtheme;