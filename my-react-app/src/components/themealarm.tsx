import React from 'react'
type AlarmType = "Alarm" | "Timer" | "Stopwatch" | "Worldclock";
type Theme = {
    theme: 'black' | 'white'
};
import Alarmtheme from './alarmtheme';
import Timertheme from './timertheme';
import Stopwatchtheme from './stopwatchtheme';
import Worldclocktheme from './worldclocktheme';
function Themealarm({ theme }: Theme) {
    const [selected, setselected] = React.useState<AlarmType>("Alarm");

    return (
        <div className={`${theme === "black" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>

    <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className={`inline-flex items-center p-2 mt-2 ms-3 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 
            ${theme === "black"
                ? "text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                : "text-gray-500 hover:bg-gray-100 focus:ring-gray-200"
            }`}
    >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
    </button>

    <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 
            ${theme === "black"
                ? "bg-gray-800 text-white"
                : "bg-gray-50 text-black border-r border-gray-300"
            }`}
        aria-label="Sidebar"
    >
        <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
                <li>
                    <button
                        className={`flex items-center p-2 rounded-lg group 
                            ${theme === "black"
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-900 hover:bg-black hover:text-white"
                            }`}
                        onClick={(e) => { e.preventDefault(); setselected("Alarm"); }}
                    >
                        <svg
                            className={`w-6 h-6 transition duration-75 
                                ${theme === "black"
                                    ? "text-gray-400 group-hover:text-white"
                                    : "text-gray-500 group-hover:text-white"
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="12" x2="12" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="ms-3">Alarm Clock</span>
                    </button>
                </li>
                <li>
                    <button
                        className={`flex items-center p-2 rounded-lg group 
                            ${theme === "black"
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-900 hover:bg-black hover:text-white"
                            }`}
                        onClick={(e) => { e.preventDefault(); setselected("Timer") }}
                    >
                        <svg
                            className={`shrink-0 w-5 h-5 transition duration-75 
                                ${theme === "black"
                                    ? "text-gray-400 group-hover:text-white"
                                    : "text-gray-500 group-hover:text-white"
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M6 2a1 1 0 0 0 0 2h1v2c0 2.21 1.79 4 4 4s4-1.79 4-4V4h1a1 1 0 1 0 0-2H6Zm6 8c-2.21 0-4 1.79-4 4v2H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-1v-2c0-2.21-1.79-4-4-4Zm0 2c1.105 0 2 .895 2 2v2h-4v-2c0-1.105.895-2 2-2Z" />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Timer</span>
                    </button>
                </li>
                <li>
                    <button
                        className={`flex items-center p-2 rounded-lg group 
                            ${theme === "black"
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-900 hover:bg-black hover:text-white"
                            }`}
                        onClick={(e) => { e.preventDefault(); setselected("Stopwatch") }}
                    >
                        <svg
                            className={`shrink-0 w-5 h-5 transition duration-75 
                                ${theme === "black"
                                    ? "text-gray-400 group-hover:text-white"
                                    : "text-gray-500 group-hover:text-white"
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <rect x="10" y="1" width="4" height="2" rx="1" />
                            <circle cx="12" cy="14" r="8" />
                            <path d="M12 14V9a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0Z" fill={theme === "black" ? "white" : "black"} />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Stopwatch</span>
                    </button>
                </li>
                <li>
                    <button
                        className={`flex items-center p-2 rounded-lg group 
                            ${theme === "black"
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-900 hover:bg-black hover:text-white"
                            }`}
                        onClick={(e) => { e.preventDefault(); setselected("Worldclock") }}
                    >
                        <svg
                            className={`shrink-0 w-5 h-5 transition duration-75 
                                ${theme === "black"
                                    ? "text-gray-400 group-hover:text-white"
                                    : "text-gray-500 group-hover:text-white"
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <circle cx="10" cy="10" r="8" />
                            <path d="M10 5a1 1 0 0 0-1 1v4.586l2.707 2.707a1 1 0 0 0 1.414-1.414L11 9.586V6a1 1 0 0 0-1-1Z" fill={theme === "black" ? "white" : "black"} />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">World Clock</span>
                    </button>
                </li>
            </ul>
        </div>
    </aside>

    <div className="p-4 sm:ml-64 bg-gray-900">
        {selected === "Alarm" && (
            <Alarmtheme />
        )}
        {selected === "Timer" && (
            <Timertheme />
        )}
        {selected === "Stopwatch" && (
            <Stopwatchtheme />
        )}
        {selected === "Worldclock" && (
            <Worldclocktheme />
        )}
    </div>
</div>

    )
}

export default Themealarm;
