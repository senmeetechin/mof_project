import Background from "../components/Background";
import GitHub from "../components/GitHub";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <GitHub />
      <div className="mt-20">
        <p className="text-textHead font-fontHead font-bold text-8xl text-center">
          MOF2CO<span className="text-6xl relative -bottom-5 -left-1">2</span>
        </p>
      </div>
      <div className="flex justify-center mt-10 h-full">
        <div className="flex flex-col w-3/4 h-5/6 justify-between pb-5">
          <div className="flex justify-center h-full border mb-5">
            <p className="text-white h-3/4">TEST</p>
          </div>
          <div className="flex justify-center">
            <button className="border-textHead border-2 rounded-full text-textHead text-xl py-1 w-1/4 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor">
              ADD MOF (.cif)
            </button>
          </div>
        </div>
      </div>
      <Background />
    </div>
  );
}

export default Home;
