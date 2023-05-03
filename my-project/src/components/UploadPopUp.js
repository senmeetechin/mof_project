import ActiveUpload from "../assets/upload_active.png";
import CIFfile from "../assets/file.png";

function UploadPopUp(props) {
  const fileList = props.fileList;
  const handleFileChange = props.handleFileChange;
  const handleUpload = props.handleUpload;

  const clickSelector = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="flex flex-col items-center justify-center mx-5 mt-5">
      {fileList.length === 0 ? (
        <div className="w-full h-60 flex justify-center items-center border-2 border-dashed rounded-lg">
          <button
            className="h-full w-full flex flex-col justify-center items-center opacity-50 hover:opacity-100"
            onClick={clickSelector}
          >
            <img
              src={ActiveUpload}
              alt="upload-icon"
              className={"h-1/2 w-auto"}
            />
            <p className="text-gray-500 font-fontContent font-semibold">
              Upload MOF in cif format
            </p>
          </button>
        </div>
      ) : (
        <div className="w-full h-60 flex flex-col gap-2 justify-center items-center border-2 border-dashed rounded-lg overflow-y-auto">
          {fileList.map((f, i) => {
            return (
              <div
                className="flex border border-bgColor py-1 px-4 rounded-md shadow-md"
                key={i}
              >
                <img src={CIFfile} alt="cifFile" className="w-auto h-6" />
                <p className="text-xl text-bgColor ml-1 font-fontContent">
                  {f.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col justify-center mt-5">
        {fileList.length === 0 ? (
          <button
            className="border-darkButton border-2 rounded-full text-darkButton text-lg py-1 px-10 font-fontHead cursor-pointer hover:bg-darkButton hover:text-white"
            onClick={clickSelector}
          >
            Select MOF (.cif)
          </button>
        ) : (
          <button
            className="border-darkButton border-2 rounded-full text-darkButton text-xl py-1 px-10 font-fontHead cursor-pointer hover:bg-darkButton hover:text-white"
            onClick={handleUpload}
          >
            UPLOAD MOF
          </button>
        )}
        <button
          className={
            "text-base text-gray-400 hover:text-gray-500 font-fontContent " +
            (fileList.length === 0 ? "hidden" : "")
          }
          onClick={clickSelector}
        >
          select new mof
        </button>
        <input
          multiple
          type="file"
          accept=".cif"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default UploadPopUp;
