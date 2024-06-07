import React, { useContext, useEffect, useRef, useState } from "react";
import { db, drawingDataRef } from "../lib/firebase";
import { onChildAdded, push, off, remove, ref, set } from "firebase/database";
import "firebase/compat/auth";
import { ResultChart } from "./ResultChart";
import { FinishedContext, MainContext, RefleshContext} from "../pages/Home";

//Firebase の Realtime Database 内の "drawing" ノードを参照する値を drawingData という変数に代入

const Canvas = ({ userColor}) => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [countClick, setCountClick] = useState(0);
  const [circles, setCircles] = useState([]); //描画する円の情報を保持
  const [colorResult, setColorResult] = useState([]);
  const [isFinished, setIsFinished] = useContext(FinishedContext);
  const [isPlaying, setIsPlaying] = useContext(MainContext);
  const [isChart, setIsChart] = useState(false);
  const [reset, setReset] = useState(true);
  const [reflesh, setReflesh] = useContext(RefleshContext);




    const drawCircles = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); //初期化
      circles.map(({ x, y, color, radius }) => {
        //分割代入
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        return null; // mapで何も返さない場合は、nullを返す
      });
    };


    const resetCanvas = () =>{
      console.log('----try resetCanvas-----')
      remove(drawingDataRef)
      .then(()=>{
        console.log('---DONE resetCanvas---')
        setCircles([]);
        setIsFinished(false);
      }).then(()=>{
        drawCircles();    
        set(ref(db, 'gameState/isPlaying'),false);
        set(ref(db, 'gameState/isFinished'),false);
        set(ref(db, 'sharedTimer/time'), 0);
        set(ref(db, 'sharedTimer/isRunning'), false);
        setIsChart(false);
        setCountClick(0);
      })
      .catch(()=>{console.log('---EROOR  resetCanvas---')})
    
     }

     useEffect(()=>{
      resetCanvas();
     },[reflesh])

  

  //効果音
  const audioRef1 = useRef();
  const audioRef2 = useRef();
  const playAudio = () => {
    const num = Math.floor(Math.random() * 2);
    if(num === 0){
      audioRef1.current.load();
      audioRef1.current.play();
    }else{
      audioRef2.current.load();
      audioRef2.current.play();
    }

  }

  const width = 800;
  const height = 400;

  const rightClick = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    console.log('==rightClicked==')
    if(isPlaying === false){return}
    if(isFinished === true){return}
    if(countClick < 10){return}
    playAudio();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); //キャンバス要素の位置サイズを取得
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCountClick(0);

    const newCircle = { x, y, color: '#6C7180', radius: 80 }; //描画する円定義
    setCircles((prevCircles) => [...circles, newCircle]);
    push(drawingDataRef, newCircle);

    const drawingDataListener = onChildAdded(drawingDataRef, (snapshot) => {
      const newCircle = snapshot.val();
      setCircles((prevCircles) => [...prevCircles, newCircle]);

 

      return () => {
        off(drawingDataRef, "child_added", drawingDataListener);
      };
    });
  }
  
  useEffect(()=>{
    const drawingDataListener = onChildAdded(drawingDataRef, (snapshot) => {
      const newCircle = snapshot.val();
      setCircles((prevCircles) => [...prevCircles, newCircle]);

      return () => {
        off(drawingDataRef, "child_added", drawingDataListener);
      };
    });
  },[]);

  useEffect(() => {
    console.log('---drawing---')
    console.log(`isPlaying = ${isPlaying}`)
if(isPlaying){drawCircles();} //すべて描画し直している(circlesを再描画)
  console.log(`isFinished = ${isFinished}`)
     
  }, [circles, isFinished]);

  const mouseDown = (e) => {
    //座標の補正
    console.log(e);
    if(e.button === 2){return}
    console.log("==mouseDown==");
    console.log(`isPlaying = ${isPlaying}`)
    if(isPlaying === false){return}
    if(isFinished === true){return}
    playAudio();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect(); //キャンバス要素の位置サイズを取得
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if(countClick < 10){
      setCountClick(countClick+1);
    }

    const newCircle = { x, y, color: userColor, radius: 20 }; //描画する円定義
    setCircles((prevCircles) => [...circles, newCircle]);
    push(drawingDataRef, newCircle);

    const drawingDataListener = onChildAdded(drawingDataRef, (snapshot) => {
      const newCircle = snapshot.val();
      setCircles((prevCircles) => [...prevCircles, newCircle]);

 

      return () => {
        off(drawingDataRef, "child_added", drawingDataListener);
      };
    });
  };

  

  const calcColor = () => {
    const color1 = [255, 251, 143];
    const color2 = [115, 200, 206];
    const color3 = [255, 148, 148];
    const color4 = [162, 229, 148];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    console.dir(imgData);
    console.dir(data);
    const colorResult = {
      color1: 0,
      color2: 0,
      color3: 0,
      color4: 0
    }

    // 画像データをループしてピクセルをカウントする
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // const color = `rgb(${r},${g},${b})`;
      const color = [r, g, b];

      //色の判定
      if (color.every((value, index) => value === color1[index])) {
        colorResult.color1++;
      }
      if (color.every((value, index) => value === color2[index])) {
        colorResult.color2++;
      }
      if (color.every((value, index) => value === color3[index])) {
        colorResult.color3++;
      }
      if (color.every((value, index) => value === color4[index])) {
        colorResult.color4++;
      }
    }
    // console.log(colorResult);
    setColorResult(colorResult);
    setIsChart(true);
  };

if(!isChart && isFinished){calcColor();}

const refleshing = () => {
  set(ref(db, 'gameState/isRefleshed'), true);
}

useEffect(()=>{
  console.log('===refleshing===')
  if(reflesh === true){
    resetCanvas();
    set(ref(db, 'gameState/isRefleshed'), false)
  }
},[reflesh])



  //css
  const css = 
  {
    selectColor: `w-20 h-10 m-2 bg-[${userColor}]`,
    result: `z-50 relative top-100 right-0 left-0 bottom-0 ${isFinished ? '' : 'hidden'} `,

  }

  return (
    <div className="absolute  top-0 w-full">
 
      <div className="flex items-center"><div className={css.selectColor}></div> <span className="text-black text-4xl">{'PaintBattle'}</span><span className="ml-10 text-4xl">{countClick}</span></div>
      <canvas
        className="relative bg-gray-500 z-20 top-0 right-0 left-0 bottom-0 m-auto "
        width={width}
        height={height}
        ref={canvasRef}
        onMouseDown={mouseDown}
        onContextMenu={rightClick}
      ></canvas>

      {/* <button
      className="text-white bg-green-400 w-20 h-10"
      onClick = {calcColor}
      >
        Result
      </button> */}
      <button className="text-white bg-red-500 w-20 h-10 m-4"
      onClick={refleshing}
      >
        Reset
      </button>
     
   
        {isFinished ?  <div 
    className="bg-gray-800 w-80 h-80 absolute top-0 left-0 bottom-0 right-0 m-auto z-50"
    > <ResultChart 
      colorResult={(colorResult)}
      className='relative top-0 right-0 left-0 bottom-0 hidden'
      /></div> : null }
 

    <audio ref={audioRef1} src="splash1.mp3"></audio>
    <audio ref={audioRef2} src="splash2.mp3"></audio>
    </div>
  );
};

export default Canvas;
