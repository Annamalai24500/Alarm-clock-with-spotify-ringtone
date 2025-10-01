import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

type Props = {
  Label: string,
  onClose: () => void,
  isOpen: boolean,
}
type Ringtone = {
  name: string,
  spotifyid: string,
  url: string,
  imageurl: string,
}
function Modalalarm({ Label, onClose, isOpen }: Props) {
  const date = new Date();
  const currenttime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [ringtones, setRingtones] = useState<Ringtone[]>([]);
  const [selectedRingtone, setSelectedRingtone] = useState<Ringtone>({name:'', spotifyid:'', url:'', imageurl:''});
  const [Hour, setHour] = useState<number>(0);
  const [Minute, setMinute] = useState<number>(0);
  const [AMPM, setAMPM] = useState<"AM" | "PM">("AM");
  const getRingtones = async() =>{
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/spotify/getringtones`,);
      console.log(response.data);
      if(response.data.success){
      setRingtones(response.data.data);
      }
      else{
        console.log("Failed to fetch ringtones");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const createAlarm = async()=>{
    try {
      const response = await axios.post(`http://127.0.0.1:3000/api/spotify/createalarm`,{Hour, Minute, AMPM, Label, ringtone:selectedRingtone.url});
      if(response.data.success){
        console.log("Alarm created successfully");
        setHour(0);
        setMinute(0);
        setAMPM("AM");
        setSelectedRingtone({name:'', spotifyid:'', url:'', imageurl:''});
        onClose();
      }else{
        console.log("Failed to create alarm");
      }
    } catch (error) {
      console.log(error);
    }
  } 
  useEffect(()=>{
    getRingtones();
  },[]);
  return (
    <div>
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel={Label}
    className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
    overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
  >
    <button
      onClick={onClose}
      className="absolute top-3 right-3 px-3 py-1 rounded bg-red-600 hover:bg-red-500"
    >
      Close
    </button>
    <h2 className="text-lg mb-2">Current time:</h2>
    <h2 className="text-xl font-mono mb-4">{currenttime}</h2>
    <div className="flex items-center space-x-2 mb-4 flex-wrap">
      <input
        type="number"
        name="Hours"
        id="Hours"
        min="1"
        max="12"
        className="w-16 text-center bg-gray-800 border border-gray-600 rounded-md text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onChange={(e) => setHour(parseInt(e.target.value))}
      />
      <span className="text-xl">:</span>
      <input
        type="number"
        name="Minute"
        id="Minute"
        min="0"
        max="59"
        className="w-16 text-center bg-gray-800 border border-gray-600 rounded-md text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onChange={(e) => setMinute(parseInt(e.target.value))}
      />
      <select
        name="AMPM"
        id="AMPM"
        className="w-20 text-center bg-gray-800 border border-gray-600 rounded-md text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onChange={(e) => setAMPM(e.target.value as "AM" | "PM")}
      >
        <option value={"AM"}>AM</option>
        <option value={"PM"}>PM</option>
      </select>
      <label className="ml-4 text-sm text-gray-300" htmlFor="ringtone">
        Choose ringtone
      </label>
      <select
        id="ringtone"
        name="ringtone"
        className="bg-gray-800 border border-gray-600 rounded-md text-teal-400 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
        onChange={(e) => {
          const ring = ringtones.find(
            (ringtone) => ringtone.url === e.target.value
          );
          if (ring) setSelectedRingtone(ring);
          console.log(selectedRingtone);
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select a ringtone
        </option>
        {ringtones.map((ringtone) => (
          <option key={ringtone.url} value={ringtone.url}>
            {ringtone.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          createAlarm();
          onClose();
        }}
        className="ml-4 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
      >
        Set Alarm
      </button>
    </div>
  </Modal>
</div>
  )
}

export default Modalalarm;