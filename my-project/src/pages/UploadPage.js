import Background from "../components/Background";
import GitHub from "../components/GitHub";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const { state } = useLocation();
  const initFileList = state.fileList;
  const [fileList, setFileList] = useState([]);
  const [removeName, setRemoveName] = useState(null);
  const navigate = useNavigate();

  // Initialize file list
  useEffect(() => {
    setFileList(initFileList);
  }, [initFileList]);

  // Remove unwanted file in file list
  useEffect(() => {
    if (removeName) {
      // Back to main page if fileList is empty
      if (fileList.length <= 1) {
        navigate("/");
      }
      // Remove unwanted file in list
      else {
        const removeIndex = fileList.indexOf(removeName)
        fileList.splice(removeIndex, 1);
        setFileList(fileList);
        setRemoveName(null);
      }
    }
  }, [fileList, removeName]);

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
          <div className="flex justify-center gap-5 h-full w-full mb-10">
            {fileList.length !== 0 &&
              fileList.map((name) => (
                <Card
                  fname={name}
                  setRemoveName={setRemoveName}
                />
              ))}
          </div>
          <div className="flex justify-center">
            <button className="border-textHead border-2 bg-opacity-75 bg-bgColor rounded-full text-textHead text-xl py-1 w-1/4 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor">
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
