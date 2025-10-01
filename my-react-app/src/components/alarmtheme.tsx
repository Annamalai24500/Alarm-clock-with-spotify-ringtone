import React, { useEffect, useState, useCallback } from 'react';
import Modalalarm from './modalalarm';
import axios from 'axios';
import WebPlayback from './WebPlayback';
import Login from './Login';

type Alarm = {
    _id: string; 
    Hour: number,
    Minute: number,
    AMPM: string,
    ringtone: string,
    label: string,
}

function Alarmtheme(){
    const [showalarmmodal, setshowalarmmodal] = useState(false);
    const [alarms, setalarms] = useState<Alarm[]>([]);
    const [token,settoken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [ringingAlarmUri, setRingingAlarmUri] = useState<string>('');
    const [isRinging, setIsRinging] = useState<boolean>(false);

    const gettoken = async () =>{
        try {
            const response =await axios.get('http://127.0.0.1:3000/auth/token');
            if(response.data.success && response.data.access_token){
                settoken(response.data.access_token);
            }else{
                console.log('error fetching token dawg');
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    function closealarmmodal() {
        setshowalarmmodal(false);
    }

    const getAlarms = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/spotify/getalarms');
            if (response.data.success) {
                setalarms(response.data.data);
                console.log("Alarms fetched successfully");
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const checkAlarmTime = useCallback(() => {
        const now = new Date();
        const currentHour24 = now.getHours();
        const currentMinute = now.getMinutes();
        const currentMinutePadded = String(currentMinute).padStart(2, '0');
        let alarmIsRinging = false;
        let alarmUri = '';
        for (const alarm of alarms) {
            let alarmHour24 = alarm.Hour;
            if (alarm.AMPM === 'PM' && alarm.Hour !== 12) {
                alarmHour24 += 12;
            } else if (alarm.AMPM === 'AM' && alarm.Hour === 12) {
                alarmHour24 = 0;
            }
            const alarmMinutePadded = String(alarm.Minute).padStart(2, '0');
            if (currentHour24 === alarmHour24 && currentMinutePadded === alarmMinutePadded) {
                alarmIsRinging = true;
                alarmUri = alarm.ringtone;
                break;
            }
        }
        if (alarmIsRinging) {
             if (!isRinging || ringingAlarmUri !== alarmUri) {
                console.log(`Time match! Starting alarm for URI: ${alarmUri}`);
                setRingingAlarmUri(alarmUri);
                setIsRinging(true);
             }
        } else if (isRinging) {
            setIsRinging(false);
            setRingingAlarmUri('');
        }
        
    }, [alarms, isRinging, ringingAlarmUri]); 

    useEffect(() => {
        getAlarms();
        gettoken();
        const intervalId = setInterval(checkAlarmTime, 1000); 
        return () => clearInterval(intervalId); 
    }, [checkAlarmTime]); 

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-4">
            {token === '' ? (<Login/>) : 
            (<>
                <nav className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-green-500">My Spotify Alarms</h1>
                    <button
                        className="flex items-center justify-center p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                        onClick={(e) => { e.preventDefault(); setshowalarmmodal(true) }}
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </nav>
                <Modalalarm isOpen={showalarmmodal} onClose={closealarmmodal} Label="Set Alarm" />
                <div className="mb-6 border-b border-gray-800 pb-4">
                    <WebPlayback 
                        token={token}
                        ringtoneUri={ringingAlarmUri}
                        isRinging={isRinging}
                    />
                </div>
                
                <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {alarms && alarms.map((alarm, index) => (
                        <div
                            key={alarm._id || index} 
                            className={`bg-zinc-900 p-4 rounded-xl shadow-lg border-2 
                                ${isRinging && ringingAlarmUri === alarm.ringtone ? 'border-red-500 ring-4 ring-red-500/50 animate-pulse-border' : 'border-gray-800'} 
                                transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                        >
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-extrabold text-white leading-tight">
                                    {String(alarm.Hour).padStart(2, '0')}:{String(alarm.Minute).padStart(2, '0')}
                                </h1>
                                <span className="text-md font-semibold text-green-400 mt-1">{alarm.AMPM}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{alarm.label || 'Alarm'}</p>
                            <p className="text-xs text-gray-500 mt-2 truncate">Ringtone: {alarm.ringtone.split(':').pop()}</p>
                            
                            {isRinging && ringingAlarmUri === alarm.ringtone && (
                                <p className="text-red-500 text-xs mt-1 font-bold">🔔 RINGING!</p>
                            )}
                        </div>
                    ))}
                </main>
            </>)
            }
        </div>
    )
}

export default Alarmtheme;