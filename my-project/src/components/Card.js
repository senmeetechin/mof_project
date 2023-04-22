import MOFViz from "./MOFViz";
import { CgClose } from "react-icons/cg";
import { HiOutlineZoomIn } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Card(props) {
  const fname = props.fname;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState([]);
  const [porE, setPorE] = useState(null);
  const [zeo, setZeo] = useState(null);
  const [predict, setPredict] = useState(null);

  useEffect(() => {
    const getPorE = axios.post("/getPorE", {
      mof_name: fname,
    });
    const getZeo = axios.post("/getZeo", {
      mof_name: fname,
    });

    Promise.all([getPorE, getZeo])
      .then(([poreRes, zeoRes]) => {
        setStep((step) => step + 1);
        setPorE(poreRes.status);
        setStep((step) => step + 1);
        setZeo(zeoRes.status);

        axios
          .post("/combineFeature", {
            mof_name: fname,
          })
          .then((_) => {
            setStep((step) => step + 1);
            axios
              .post("/predict", {
                mof_name: fname,
              })
              .then((res) => {
                setStep((step) => step + 1);
                setPredict(res.data);
                console.log("Prediction", res.data)
              })
              .catch((error) => {
                console.log("Predict error", error);
              });
          });
      })
      .catch((error) => {
        console.log("Extract error", error);
      });
  }, []);

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
            {<MOFViz id="mole-1-show" fpath={fname} />}
          </div>
          <div className="col-span-3 text-left flex flex-col mr-8 gap-2">
            <p className="text-2xl font-bold font-fontHead mb-1">{fname}</p>
            <div className="flex justify-between font-fontContent">
              <p>Molecular weight:</p>
              <p>5,312.93 u</p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Unit cell volume:</p>
              <p>
                21,383.00 A<sup>3</sup>
              </p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Density:</p>
              <p>
                412.60 g/cm<sup>3</sup>
              </p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Void porosity :</p>
              <p>84.45 %</p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Accessible porosity :</p>
              <p>80.86 %</p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Accessible surface area per volume:</p>
              <p>
                1,887.66 m<sup>2</sup>/cm<sup>3</sup>
              </p>
            </div>
            <div className="flex justify-between font-fontContent">
              <p>Largest included sphere:</p>
              <p>16.13 A</p>
            </div>
            <div className="flex justify-between font-fontContent mb-1">
              <p>Largest free sphere:</p>
              <p>10.92 A</p>
            </div>
            <a
              href="https://drive.google.com/uc?export=download&id=1jerlAGOcoKxXp1RsssT9l_dF0KaZ7EfL"
              // target="_blank"
              rel="noreferrer"
            >
              <button className="border-darkButton border-2 rounded-full text-darkButton text-base py-1 w-full mt-auto font-fontHead cursor-pointer hover:bg-darkButton hover:text-white flex justify-center">
                <FiDownload className="my-auto mr-2" />
                download result (.csv)
              </button>
            </a>
            {/* Phi_acc Phi_void ASA_cm3 densify Di Df */}
          </div>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: 880,
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
          {/* {fname} */}
          {<MOFViz id="mole-1" fpath={fname} />}
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
