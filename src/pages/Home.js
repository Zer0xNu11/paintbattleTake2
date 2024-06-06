import { createContext, useState } from "react";
import Canvas from "../components/Canvas";
import SelectColor from "../components/SelectColor";
import Timer from "../components/Timer";
export const MainContext = createContext();
export const RefleshContext = createContext();
export const FinishedContext = createContext();


function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReflesh, setIsReflesh] = useState(false);
  const [isFinished, setIsFinished] =useState(false);
  // const [content, setContent] = useState("");
  // const createPost = async () => {
  //   const post = await postRepository.create(content);
  //   console.log(post);
  //   setContent("");
  // };

  return (
    <div>
      <FinishedContext.Provider value={[isFinished, setIsFinished]}>
      <RefleshContext.Provider value = {[isReflesh, setIsReflesh]}>
      <MainContext.Provider value ={ [isPlaying, setIsPlaying]}>
        <Timer  />
        <SelectColor />
      </MainContext.Provider>
      </RefleshContext.Provider>
      </FinishedContext.Provider>
    </div>
  );
}

export default Home;
