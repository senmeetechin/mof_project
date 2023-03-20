import Background from "../components/Background"
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex h-screen w-screen">
      <header className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col gap-8">
          <h1 className="text-textHead font-fontHead font-bold text-8xl text-center">
            MOF2CO<span className="text-6xl relative -bottom-5 -left-1">2</span>
          </h1>
          <div className="text-white font-fontContent text-2xl text-center">
            <p>
              Predicting Carbon Dioxide Absorption Capacity of Metal-organic
              Framework in 3 Step
            </p>
            <p>Upload .CIF | Visualize MOF | Get data</p>
          </div>
          <div className="flex justify-center">
            <Link to="/upload">
              <button className="border-textHead border-2 rounded-full text-textHead text-xl py-1 px-28 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor">
                UPLOAD MOF (.cif)
              </button>
            </Link>
          </div>
        </div>
      </header>
      <Background/>
    </div>
  );
}

export default Home;
