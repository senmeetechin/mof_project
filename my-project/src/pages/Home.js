import Background from "../components/Background";
import GitHub from "../components/GitHub";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("fileData", reader.result);
    };

    reader.readAsText(file);
  };

  const uploadFile = () => {
    document.getElementById('fileInput').click();
    navigate("/upload");
  };

  return (
    <div className="flex h-screen w-screen">
      <GitHub />
      <header className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col gap-8">
          <h1 className="text-textHead font-fontHead font-bold text-8xl text-center">
            MOF2CO<span className="text-6xl relative -bottom-5 -left-1">2</span>
          </h1>
          <div className="text-white font-fontContent text-2xl text-center">
            <p>
              Predicting Carbon Dioxide Adsorption Capacity of Metal-organic
              Framework in 3 Step
            </p>
            <p>Upload .CIF | Visualize MOF | Get data</p>
          </div>
          <div className="flex justify-center">
            <button
              className="border-textHead border-2 rounded-full text-textHead text-xl py-1 px-28 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor"
              onClick={uploadFile}
            >
              UPLOAD MOF (.cif)
            </button>

            <input type="file" id="fileInput" onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      </header>
      <Background />
    </div>
  );
}

export default Home;
