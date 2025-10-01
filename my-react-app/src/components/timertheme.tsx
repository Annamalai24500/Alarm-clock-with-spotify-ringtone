import React from 'react'
import {useState, useEffect, useRef} from 'react';
//finished my man only alarm remaining
function Timertheme() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [inputgiven, setInputgiven] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const formatValue = (val: number) => String(val).padStart(2, "0");
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      const { hours: savedHours, minutes: savedMinutes, seconds: savedSeconds, 
              timeLeft: savedTimeLeft, isRunning: savedIsRunning, inputgiven: savedInputgiven } = JSON.parse(savedState);
      setHours(savedHours);
      setMinutes(savedMinutes);
      setSeconds(savedSeconds);
      setInputgiven(savedInputgiven);
      if (savedInputgiven) {
        if (savedIsRunning && savedTimeLeft > 0) {
          const lastSaved = JSON.parse(localStorage.getItem('timerState') || '{}').lastSaved;
          const timePassed = lastSaved ? Math.floor((Date.now() - lastSaved) / 1000) : 0;
          const actualTimeLeft = Math.max(0, savedTimeLeft - timePassed);
          
          setTimeLeft(actualTimeLeft);
          setIsRunning(actualTimeLeft > 0);
          
          if (actualTimeLeft > 0) {
            intervalRef.current = setInterval(() => {
              setTimeLeft(prev => {
                if (prev <= 1) {
                  setIsRunning(false);
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                  }
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        } else {
          setTimeLeft(savedTimeLeft);
          setIsRunning(false);
        }
      }
    }
  }, []);
  useEffect(() => {
    const stateToSave = {
      hours,
      minutes,
      seconds,
      timeLeft,
      isRunning,
      inputgiven,
      lastSaved: Date.now()
    };
    localStorage.setItem('timerState', JSON.stringify(stateToSave));
  }, [hours, minutes, seconds, timeLeft, isRunning, inputgiven]);
  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setInputgiven(true);
      setIsRunning(true);
    }
  };
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && inputgiven) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, inputgiven]);
  const displayHours = Math.floor(timeLeft / 3600);
  const displayMinutes = Math.floor((timeLeft % 3600) / 60);
  const displaySeconds = timeLeft % 60;
  const totalDuration = hours * 3600 + minutes * 60 + seconds;
  const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  const resumeTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  };
  const resetTimer = () => {
    setIsRunning(false);
    setInputgiven(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    localStorage.removeItem('timerState');
  };
  useEffect(() => {
    if (timeLeft === 0 && inputgiven) {
      const timer1 = setInterval(()=>{
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log('Audio failed', e));
        }
      },5000);
      const timer = setTimeout(() => {
        localStorage.removeItem('timerState');
      }, 1000);
      return () => {clearTimeout(timer); clearInterval(timer1)};
    }
  }, [timeLeft, inputgiven]);

  return (
    <div className="min-h-screen bg-black text-white">
      {!inputgiven ? (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <input
                type="number"
                name="hours"
                id="hours"
                value={formatValue(hours)}
                min={0}
                max={23}
                onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value))))}
                className="w-20 text-center text-5xl font-bold bg-transparent outline-none"
              />
              <span className="text-sm text-gray-400 mt-2">HOURS</span>
            </div>
            <span className="text-5xl">:</span>
            <div className="flex flex-col items-center">
              <input
                type="number"
                name="minutes"
                id="minutes"
                value={formatValue(minutes)}
                min={0}
                max={59}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-20 text-center text-5xl font-bold bg-transparent outline-none"
              />
              <span className="text-sm text-gray-400 mt-2">MINUTES</span>
            </div>
            <span className="text-5xl">:</span>
            <div className="flex flex-col items-center">
              <input
                type="number"
                name="seconds"
                id="seconds"
                value={formatValue(seconds)}
                min={0}
                max={59}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-20 text-center text-5xl font-bold bg-transparent outline-none"
              />
              <span className="text-sm text-gray-400 mt-2">SECONDS</span>
            </div>
          </div>
          
          <button 
            onClick={startTimer}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full text-lg font-semibold transition-colors"
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen space-y-8">
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#374151"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#10B981"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-center">
                {formatValue(displayHours)}:{formatValue(displayMinutes)}:{formatValue(displaySeconds)}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {isRunning ? 'Running' : 'Paused'}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-full font-semibold transition-colors"
              >
                Pause
              </button>
            ) : timeLeft > 0 ? (
              <button
                onClick={resumeTimer}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full font-semibold transition-colors"
              >
                Resume
              </button>
            ) : null}
            
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-full font-semibold transition-colors"
            >
              Reset
            </button>
          </div>
          {timeLeft === 0 && inputgiven && (
            <div className="text-2xl text-green-400 font-bold animate-pulse">
              Timer Completed! ⏰
              <audio src='https://media.geeksforgeeks.org/wp-content/uploads/20240912183739/chatbot-response.mp3' preload='auto'
              ref={audioRef}>
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Timertheme;