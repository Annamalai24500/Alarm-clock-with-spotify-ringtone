import React from "react";
import Modal from "react-modal";
import axios from "axios";
import Select from "react-select";
//finished only the theme shit dawg
Modal.setAppElement("#root");
type Clock = {
  timezone: string;
  time: string;
}
function Worldclocktheme() {
  const [showworldclockmodal, setshowworldclockmodal] = React.useState(false);
  const [isClearable] = React.useState<boolean>(true);
  const [isSearchable] = React.useState<boolean>(true);
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [selectedtimezone, setselectedtimezone] = React.useState<string>("");
  const [clocks, setclocks] = React.useState<Clock[]>([]);
  function closeworldclockmodal() {
    setshowworldclockmodal(false);
  }
  const gettimezones = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:3000/api/worldclock/timezones`
      );
      if (response.data.success) {
        setTimezones(response.data.filtered);
      } else {
        console.log("Failed to fetch timezones");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const gettimezoneandcreate = async (timezone: string) => {
    try {
      if (timezone === "") return;
      const response = await axios.get(
        `http://127.0.0.1:3000/api/worldclock/world?timezone=${timezone}`
      );
      if (response.data.success) {
        console.log("alarm created successfully");
      } else {
        console.log("Failed to fetch time");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/worldclock/getworldclocks');
      if (response.data.success) {
        setclocks(response.data.clocks);
        console.log("Clocks fetched successfully");
      } else {
        console.log("Failed to fetch clocks");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const updatetime = async () =>{
    try {
      const response = await axios.put('http://127.0.0.1:3000/api/worldclock/updatetimeforclocks');
      if(response.data.success){
        console.log('time updated successfully');
      }else{
        console.log('nah twin');
      }
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    gettimezones();
    getData();
    updatetime();
  }, []);

  return (
    <div>
      <nav>
        <button
          className="flex items-center justify-center p-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white"
          onClick={(e) => {
            e.preventDefault();
            setshowworldclockmodal(true);
          }}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </nav>

      <main>
        <Modal
          isOpen={showworldclockmodal}
          onRequestClose={closeworldclockmodal}
          contentLabel={"World Clock"}
          className="bg-gray-900 text-white p-6 rounded-xl shadow-2xl w-full max-w-md mx-auto relative border border-gray-700"
          overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
        >
          <button
            onClick={closeworldclockmodal}
            className="absolute top-3 right-3 px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-sm"
          >
            ✕
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              gettimezoneandcreate(selectedtimezone);
              setselectedtimezone("");
              closeworldclockmodal();
            }}
          >
            <Select
              className="w-full text-black"
              classNamePrefix="select"
              options={timezones.map((timezone) => ({
                value: timezone,
                label: timezone,
              }))}
              isClearable={isClearable}
              isSearchable={isSearchable}
              onChange={(selectedOption) =>
                setselectedtimezone(selectedOption ? selectedOption.value : "")
              }
            />

            <button
              type="submit"
              className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Save
            </button>
          </form>
        </Modal>
        {clocks && clocks.length > 0 ? (
          clocks.map((clock, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-400">
                {clock.timezone}
              </h3>
              <p className="text-gray-300 mt-2">{clock.time}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No clocks saved yet.</p>
        )}
      </main>
    </div>
  );
}

export default Worldclocktheme;
