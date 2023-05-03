import Background from "../components/Background";
import GitHub from "../components/GitHub";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UploadPopUp from "../components/UploadPopUp";

const client = axios.create({
  baseURL: "https://mof2co2-backend-b6fb5aeiza-as.a.run.app",
});

function Home() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const MySwal = withReactContent(Swal);

  const handleFileChange = (event) => {
    const collectedFiles = Array.from(event.target.files);
    setFileList(collectedFiles);
  };

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file, i) => {
      formData.append(`file`, file, file.name);
    });

    client
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        MySwal.close();
        navigate("/upload", {
          state: { fileList: fileList.map((file) => file.name) },
        });
      })
      .catch((error) => {
        console.log("Upload error:", error);
      });
  };

  const resetFileList = () => {
    setFileList([]);
  };

  useEffect(() => {
    if (fileList.length !== 0) {
      MySwal.update({
        html: (
          <UploadPopUp
            fileList={fileList}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />
        ),
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        width: 600,
      });
    }
  }, [fileList]);

  const selectMof = () => {
    MySwal.fire({
      html: (
        <UploadPopUp
          fileList={fileList}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />
      ),
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      width: 600,
    }).then((result) => {
      if (result.isDismissed) {
        resetFileList();
        // document.getElementById("fileInput").click();
      }
    });
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
            <p className="">Upload .CIF | Visualize MOF | Get data</p>
          </div>
          <div className="flex justify-center gap-2">
            <button
              className="border-textHead border-2 rounded-full text-textHead text-xl py-1 px-28 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor"
              onClick={selectMof}
            >
              Select MOF (.cif)
            </button>
          </div>
        </div>
      </header>
      <Background />
    </div>
  );
}

export default Home;
