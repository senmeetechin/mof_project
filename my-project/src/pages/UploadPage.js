import Background from "../components/Background";
import GitHub from "../components/GitHub";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UploadPopUp from "../components/UploadPopUp";
import axios from "axios";

const client = axios.create({
  baseURL: "https://mof2co2-backend-b6fb5aeiza-as.a.run.app",
});

function UploadPage() {
  const { state } = useLocation();
  const initFileList = state.fileList;
  const [fileList, setFileList] = useState([]);
  const [removeName, setRemoveName] = useState(null);
  const navigate = useNavigate();
  const [newFileList, setNewFileList] = useState([]);
  const MySwal = withReactContent(Swal);

  const addFileList = () => {
    setFileList((fileList) =>
      fileList.concat(newFileList.map((file) => file.name))
    );
    setNewFileList([]);
  };

  const handleFileChange = (event) => {
    const collectedFiles = Array.from(event.target.files);
    setNewFileList(collectedFiles);
  };

  const handleUpload = () => {
    const formData = new FormData();
    newFileList.forEach((file, i) => {
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
        addFileList();
      })
      .catch((error) => {
        console.log("Upload error:", error);
      });
  };

  const resetNewFileList = () => {
    setNewFileList([]);
  };

  useEffect(() => {
    if (newFileList.length !== 0) {
      MySwal.update({
        html: (
          <UploadPopUp
            fileList={newFileList}
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
  }, [newFileList]);

  const selectMof = () => {
    MySwal.fire({
      html: (
        <UploadPopUp
          fileList={newFileList}
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
        resetNewFileList();
        // document.getElementById("fileInput").click();
      }
    });
  };

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
        const removeIndex = fileList.indexOf(removeName);
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
                <Card fname={name} setRemoveName={setRemoveName} />
              ))}
          </div>
          <div className="flex justify-center">
            <button
              className="border-textHead border-2 bg-opacity-75 bg-bgColor rounded-full text-textHead text-xl py-1 w-1/4 font-fontHead cursor-pointer hover:bg-textHead hover:text-bgColor"
              onClick={selectMof}
            >
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
