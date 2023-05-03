import MOFViz from "./MOFViz";
import { CgClose } from "react-icons/cg";
import { HiOutlineZoomIn } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { download } from "3dmol";

const client = axios.create({
  baseURL: "http://127.0.0.1:5000" //"https://mof2co2-backend-b6fb5aeiza-as.a.run.app",
});

function Card(props) {
  const fname = props.fname;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [cifData, setCifData] = useState(null);
  const [data, setData] = useState(null);
  const [porE, setPorE] = useState(null);
  const [zeo, setZeo] = useState(null);
  const [predict, setPredict] = useState(null);

  useEffect(() => {
    client
      .post("/data", {
        mof_name: fname,
      })
      .then((res) => {
        setData(res.data);
        console.log("DATA", res.data);
      });
  }, [fname, step]);

  useEffect(() => {
    async function getCifContent() {
      const response = await client.post("/cifContent", {
        mof_name: fname,
      });
      setCifData(response.data.cifData);
      setStep((step) => step + 1);
    }
    getCifContent();
  }, [fname]);

  useEffect(() => {
    const getPorE = client.post("/getPorE", {
      mof_name: fname,
    });
    const getZeo = client.post("/getZeo", {
      mof_name: fname,
    });

    Promise.all([getPorE, getZeo])
      .then(([poreRes, zeoRes]) => {
        setStep((step) => step + 1);
        setPorE(poreRes.status);
        setZeo(zeoRes.status);

        client
          .post("/combineFeature", {
            mof_name: fname,
          })
          .then((_) => {
            console.log("PREDICT PASS");
            setStep((step) => step + 1);
            client
              .post("/predict", {
                mof_name: fname,
              })
              .then((res) => {
                setStep((step) => step + 1);
                setPredict(res.data);
              })
              .catch((error) => {
                console.log("Predict error", error);
              });
          });
      })
      .catch((error) => {
        console.log("Extract error", error);
      });
  }, [fname]);

  const closeCard = () => {
    const MySwal = withReactContent(Swal);
    const name = fname;
    MySwal.fire({
      title: "Are you sure?",
      html: (
        <div className="">
          <p className="mb-1">
            You are going to remove <span className="font-bold">{name}</span>
          </p>
          <p>You won't be able to revert this!</p>
        </div>
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      width: 600,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", name + " has been deleted.", "success");
        navigate("/");
      }
    });
  };

  const zoomIn = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      html: (
        <div className="grid grid-cols-5 py-3 gap-5">
          <div className="col-span-2 h-full relative my-auto">
            {cifData && (
              <MOFViz id={fname+"-zoom"} fpath={fname} cifData={cifData} />
            )}
          </div>
          <div className="col-span-3 text-left flex flex-col mr-6 gap-2">
            <p className="text-2xl font-bold font-fontHead mb-1">{fname}</p>
            <div className="flex flex-col h-48 gap-2 overflow-y-auto">
              <div className="flex justify-between font-fontContent">
                <p>Largest included sphere:</p>
                {data && data["Di"] !== -99 ? (
                  <p>
                    <span>{data && data["Di"].toFixed(2)}</span> Å
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Largest free sphere:</p>
                {data && data["Df"] !== -99 ? (
                  <p>
                    <span>{data && data["Df"].toFixed(2)}</span> Å
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Largest included sphere along free sphere path:</p>
                {data && data["Dif"] !== -99 ? (
                  <p>
                    <span>{data && data["Dif"].toFixed(2)}</span> Å
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Volume:</p>
                {data && data["volume"] !== -99 ? (
                  <p>
                    <span>{data && data["volume"].toFixed(2)}</span> Å
                    <sup>3</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Density:</p>
                {data && data["density"] !== -99 ? (
                  <p>
                    <span>{data && data["density"].toFixed(2)}</span> g/cm
                    <sup>3</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Accessible surface area per unit cell:</p>
                {data && data["ASA_A2"] !== -99 ? (
                  <p>
                    <span>{data && data["ASA_A2"].toFixed(2)}</span> Å
                    <sup>2</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Accessible surface area per volume:</p>
                {data && data["ASA_m2/cm3"] !== -99 ? (
                  <p>
                    <span>{data && data["ASA_m2/cm3"].toFixed(2)}</span> m
                    <sup>2</sup>
                    /cm<sup>3</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Accessible surface area per mass:</p>
                {data ? (
                  <p>
                    <span>{data && data["ASA_m2/g"].toFixed(2)}</span> m
                    <sup>2</sup>/g
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Non-accessible surface area per unit cell:</p>
                {data && data["NASA_A2"] !== -99 ? (
                  <p>
                    <span>{data && data["NASA_A2"].toFixed(2)}</span> Å
                    <sup>2</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Non-accessible surface area per volume:</p>
                {data && data["NASA_m2/cm3"] !== -99 ? (
                  <p>
                    <span>{data && data["NASA_m2/cm3"].toFixed(2)}</span> m
                    <sup>2</sup>
                    /cm
                    <sup>3</sup>
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Non-accessible surface area per mass:</p>
                {data && data["NASA_m2/g"] !== -99 ? (
                  <p>
                    <span>{data && data["NASA_m2/g"].toFixed(2)}</span> m
                    <sup>2</sup>/g
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Void porosity:</p>
                {data && data["Phi_void"] !== -99 ? (
                  <p>
                    <span>{data && data["Phi_void"].toFixed(2)}</span> %
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Accessible porosity:</p>
                {data && data["Phi_acc"] !== -99 ? (
                  <p>
                    <span>{data && data["Phi_acc"].toFixed(2)}</span> %
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Pore volume density with reference to void porosity:</p>
                {data && data["poreV_void"] !== -99 ? (
                  <p>
                    <span>{data && data["poreV_void"].toFixed(2)}</span> cm
                    <sup>3</sup>/g
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
              <div className="flex justify-between font-fontContent">
                <p>Pore volume density with reference to void porosity:</p>
                {data ? (
                  <p>
                    <span>{data && data["poreV_acc"].toFixed(2)}</span> cm
                    <sup>3</sup>/g
                  </p>
                ) : (
                  <p>extracting...</p>
                )}
              </div>
            </div>
            {data && data["CO2_adsorption"] !== -99 && (
              <div className="flex justify-between font-fontContent mr-2 mt-1">
                <p>
                  CO<sub>2</sub> adsorption capacity:
                </p>

                <p>
                  <span>{data && data["CO2_adsorption"].toFixed(2)}</span>{" "}
                  mmol/g
                </p>
              </div>
            )}
            <button
              className="border-darkButton border-2 rounded-full text-darkButton text-base py-1 w-full mt-2 font-fontHead cursor-pointer hover:bg-darkButton hover:text-white flex justify-center disabled:bg-white disabled:text-darkButton disabled:cursor-wait"
              disabled={data && data["CO2_adsorption"] !== -99 ? false : true}
              onClick={downloadResult}
            >
              <FiDownload className="my-auto mr-2" />
              download result (.csv)
            </button>
            {/* Phi_acc Phi_void ASA_cm3 densify Di Df */}
          </div>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: 1000,
    });
  };

  const downloadResult = () => {
    client
      .post("/download", {
        mof_name: fname,
      })
      .then((res) => {
        const csvName = fname.replace(".cif", "") + "_result.csv";
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", csvName);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className="relative flex flex-col h-80 w-80 bg-white rounded-2xl">
      <div className="bg-gray-300 rounded-t-2xl text-center py-1 text-xl font-fontContent h-10 relative">
        <p title={fname}>
          {fname.slice(0, 20)}
          {fname.length >= 22 && "..."}
        </p>
        <CgClose
          className="absolute top-1/2 right-7 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
          onClick={closeCard}
        />
      </div>
      <div className="h-full w-full px-6 pt-3 pb-0">
        <div className="w-full h-full relative">
          <HiOutlineZoomIn
            className="absolute z-10 right-0 top-0 text-xl text-gray-500 hover:text-gray-800 cursor-pointer bg-white rounded-bl-sm"
            onClick={zoomIn}
          />

          {cifData && <MOFViz id={fname+"-show"} fpath={fname} cifData={cifData} />}
        </div>
      </div>
      <div className="flex justify-center h-16 items-center">
        {step < 4 ? (
          <div className="relative bg-gray-300 w-5/6 rounded-2xl text-center text-sm">
            <p className="invisible">PowerTubeSize</p>
            <div className="absolute h-full w-full left-0 top-0 z-10">
              <p>{step < 3 ? "extracting..." : "predicting..."}</p>
            </div>
            {step > 0 && (
              <div
                className={
                  "absolute h-full bg-textHead left-0 top-0 rounded-l-2xl z-0 " +
                  "w-" +
                  step.toString() +
                  "/4"
                }
              ></div>
            )}
          </div>
        ) : (
          <div className="relative flex justify-center bg-white w-full rounded-2xl text-center gap-2">
            <p className="text-base">
              CO<sub>2</sub> adsorption:{" "}
              <span className="text-lg">
                {predict && parseFloat(predict.prediction).toFixed(4)}
              </span>{" "}
              mmol/g
            </p>
            <FiDownload className="my-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
