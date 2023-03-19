import { Link } from "react-router-dom";
import BackgroundImage from "./assets/bg-bottom.png";
import GitHubLogo from "./assets/github-mark-white.svg";

function Home() {
  return (
    <div className="bg-bgColor h-screen w-screen">
      <header className="flex h-full w-full items-center justify-center">
        <a
          href="https://github.com/senmeetechin/mof_project"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={GitHubLogo}
            alt="GitHub"
            className="w-12 h-12 absolute right-5 top-5"
          />
        </a>
        <div className="flex flex-col gap-8">
          <h1 className="text-textHead font-fontHead text-8xl text-center">
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
            <button className="border-textHead border-2 rounded-full text-textHead py-1 px-10 font-fontHead">
              Upload MOF (.cif)
            </button>
          </div>
        </div>
      </header>
      <img
        src={BackgroundImage}
        alt="bg-img"
        className="w-full absolute bottom-0"
      />
    </div>
  );
}

export default Home;
