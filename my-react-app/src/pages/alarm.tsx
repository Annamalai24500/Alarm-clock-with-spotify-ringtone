import React from 'react'
import Themealarm from '../components/themealarm';
function Alarm() {
    const [theme,settheme]= React.useState<'black' | 'white'>('black');
  return (
    <div className={theme === "black" ? "bg-gray-900 min-h-screen" : "bg-white min-h-screen"}>
      <button
        onClick={() => settheme(theme === "white" ? "black" : "white")}
        className={`
          fixed top-4 right-4 px-4 py-2 rounded-lg font-semibold transition-all duration-300
          ${theme === "white" 
            ? "bg-white text-gray-700 shadow-[0_0_10px_2px_rgba(100,100,100,0.6)] hover:shadow-[0_0_20px_4px_rgba(80,80,80,0.8)]" 
            : "bg-black text-white shadow-[0_0_12px_3px_rgba(192,192,192,0.7)] hover:shadow-[0_0_20px_6px_rgba(220,220,220,0.9)]"}
          ${theme === "white" 
            ? "animate-pulse text-shadow-[0_0_5px_rgba(80,80,80,0.8)]" 
            : "animate-pulse text-shadow-[0_0_6px_rgba(255,255,255,0.9)]"}
        `}
      >
        Theme
      </button>
      <Themealarm theme={theme}/>
    </div>
  )
}

export default Alarm;
