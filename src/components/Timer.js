import React, { useState, useEffect, useContext } from 'react';
import { ref, onValue, set } from 'firebase/database';
import "firebase/compat/auth";
import { db } from '../lib/firebase';
import { FinishedContext, MainContext, RefleshContext} from "../pages/Home";

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useContext(MainContext);
  const [isFinished, setIsFinished] =useContext(FinishedContext);
  const [isRefleshed, setIsRefleshed] = useContext(RefleshContext);
  const maxTime = 30;
  
  useEffect(()=>{
    console.log('==playingRef==')
    const playingRef = ref(db, 'gameState/isPlaying');

    onValue(playingRef,(snapshot)=>{
      const newState = snapshot.val();
      if(newState !== null){
        setIsPlaying(newState);
      }else{
        set(ref(db, 'gameState/isPlaying'),isPlaying)
      }
    })
    
  },[isPlaying])

  useEffect(()=>{
    console.log('==isFinishedRef==')
    const isFinishedRef = ref(db, 'gameState/isFinished');

    onValue(isFinishedRef,(snapshot)=>{
      const newState = snapshot.val();
      if(newState !== null){
        setIsFinished(newState);
      }else{
        set(ref(db, 'gameState/isFinished'),isFinished)
      }
    })
    
  },[isFinished])

  useEffect(()=>{
    console.log('==Refleshed==')
    const isRefleshed = ref(db, 'gameState/isRefleshed');

    onValue(isRefleshed,(snapshot)=>{
      const newState = snapshot.val();
      if(newState !== null){
        setIsRefleshed(newState);
      }else{
        set(ref(db, 'gameState/isRefleshed'),isRefleshed)
      }
    })
    
  },[isRefleshed])



  useEffect(() => {
    const timeRef = ref(db, 'sharedTimer/time');
    const runningRef = ref(db, 'sharedTimer/isRunning');

    onValue(timeRef, (snapshot) => {
      const newTime = snapshot.val();
      if (newTime !== null) {
        setTime(newTime);
      }
    });

    onValue(runningRef, (snapshot) => {
      const running = snapshot.val();
      if (running !== null) {
        setIsRunning(running);
      }
    });

    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const updatedTime = prevTime + 1;
          set(ref(db, 'sharedTimer/time'), updatedTime);
          return updatedTime;
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    if (time >= maxTime) {
      setIsRunning(false);
      set(ref(db, 'sharedTimer/isRunning'), false);
      handleMaxTimeReached();
    }
  }, [time, maxTime]);

  const handleMaxTimeReached = () => {
    console.log('Time Out');
    set(ref(db, 'gameState/isFinished'),true)
  };


  const handleStartStop = () => {
    setIsRunning(!isRunning);
    set(ref(db, 'sharedTimer/isRunning'), !isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    set(ref(db, 'sharedTimer/time'), 0);
    set(ref(db, 'sharedTimer/isRunning'), false);
  };

  return (
    <div className='absolute top-0 right-0 mr-16 z-50 text-4xl'>
      <h1>{maxTime-time} s</h1>
      {/* <button onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={handleReset}>Reset</button> */}
    </div>
  );
};

export default Timer;