"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PomodoroTimer() {
  const [focusTime, setFocusTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [alarmOn, setAlarmOn] = useState(true);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (alarmOn) playAlarm();
      setIsFocusMode((prev) => !prev);
      setTimeLeft(isFocusMode ? breakTime : focusTime);
      if (!isFocusMode) setCycles((prev) => prev + 1);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isFocusMode, focusTime, breakTime, alarmOn]);

  const playAlarm = () => {
    const audio = new Audio("/alarm.mp3");
    audio.play();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <motion.div
        className="w-40 h-40 rounded-full border-8 border-gray-300 flex items-center justify-center relative"
        animate={{
          background: `conic-gradient(${isFocusMode ? "red" : "gray"} ${(1 - timeLeft / (isFocusMode ? focusTime : breakTime)) * 360}deg, gray 0deg)`,
        }}
        transition={{ duration: 1 }}
      >
        <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
      </motion.div>

      <div className="mt-4 flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => {
          setIsRunning(false);
          setTimeLeft(focusTime);
          setIsFocusMode(true);
          setCycles(0);
        }}>
          Reset
        </button>
      </div>

      <div className="mt-4">
        <label className="mr-2">Focus Time (minutes):</label>
        <input type="number" min="1" className="border p-1 w-12 text-center" value={focusTime / 60} onChange={(e) => setFocusTime(e.target.value * 60)} />
      </div>
      <div className="mt-2">
        <label className="mr-2">Break Time (minutes):</label>
        <input type="number" min="1" className="border p-1 w-12 text-center" value={breakTime / 60} onChange={(e) => setBreakTime(e.target.value * 60)} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded" onClick={() => setAlarmOn(!alarmOn)}>
          {alarmOn ? "Turn Alarm Off" : "Turn Alarm On"}
        </button>
        <span className="text-sm">Alarm: {alarmOn ? "ON" : "OFF"}</span>
      </div>

      <div className="mt-4 text-lg font-semibold">Completed Cycles: {cycles}</div>
    </div>
  );
}
