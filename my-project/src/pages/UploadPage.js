import Background from "../components/Background";
import GitHub from "../components/GitHub";
import Card from "../components/Card"
import { useEffect } from "react";
import axios from "axios";

function UploadPage() {
  useEffect(() => {
    axios.post('/combineFeature', {
      mof_path: '../src/upload/str_m5_o5_o24_sra_sym.63.cif',
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <div className="flex flex-col h-screen w-screen">
      <GitHub />
      <div className="mt-20">
        <p className="text-textHead font-fontHead font-bold text-8xl text-center">
          MOF2CO<span className="text-6xl relative -bottom-5 -left-1">2</span>
        </p>
      </div>
      <div className="flex justify-center mt-10 h-full mb-5">
        <div className="flex flex-col w-3/4 h-5/6 justify-between pb-5">
          <div className="flex justify-center gap-2 h-full w-full mb-10">
            <Card/>
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

export default UploadPage;
