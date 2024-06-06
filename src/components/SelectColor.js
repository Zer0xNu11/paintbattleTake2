import { useContext, useEffect, useState } from "react";
import Canvas from "./Canvas";
import { MainContext } from "../pages/Home";
import { db } from "../lib/firebase";
import { ref, set } from "firebase/database";

const SelectColor = () => {
  const [userColor, setUserColor] = useState("#fffb8f");
  const [isPlaying, setIsPlaying] = useContext(MainContext);

  const changeColor = (color) => {
    setUserColor(color);
  };

  const startGame = () => {
    console.log('=== isPlaying true ===')
    set(ref(db, 'gameState/isPlaying'),true)
    set(ref(db, 'sharedTimer/isRunning'), true)
    console.log(isPlaying);
  };

  return (    
    <div className=" w-full">
      {!isPlaying &&(
      <>
      <div className="relative w-80 h-80 z-50 bg-white top-[100px] left-0 bottom-0 right-0 m-auto ">
        <button
          onClick={() => changeColor("#fffb8f")}
          className="bg-[#fffb8f] w-40 h-40 p-2"
        ></button>
        <button
          onClick={() => changeColor("#73c8ce")}
          className="bg-[#73c8ce] w-40 h-40 p-2"
        ></button>
        <button
          onClick={() => changeColor("#ff9494")}
          className="bg-[#ff9494] w-40 h-40 p-2"
        ></button>
        <button
          onClick={() => changeColor("#a2e594")}
          className="bg-[#a2e594] w-40 h-40 p-2"
        ></button>
      </div>
      <div className="relative w-80 h-10 z-50 text-2xl text-center text-white top-[100px]  left-0 bottom-0 right-0 m-auto">
        Select Your Color
        <button
        className="bg-red-500 rounded-xl z-50 shadow-black/80 shadow-md  w-auto mx-auto hover:opacity-70 transition active:translate-y-1 active:shadow-none active:opacity-40 text-white m-4 py-2 px-4"
        onClick={startGame}
      >
        StartGame
      </button>
      </div> 
      </>)}

      <Canvas
        className="bg-gray-500"
        userColor={userColor}
      />
 
    </div>
  );
};

export default SelectColor;
