import MOFViz from "./MOFViz";
import { CgClose } from "react-icons/cg";
import { HiOutlineZoomIn } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Card() {
  const zoomIn = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      html: (
        <div className="grid grid-cols-5 py-3 gap-5">
          <div className="col-span-2 h-full relative my-auto">
            <MOFViz id="mole-1-show" />
          </div>
          <div className="col-span-3 text-left flex flex-col mr-8 gap-2">
            <p className="text-2xl font-bold font-fontHead mb-1">
              cif_mof_test.31.cif
            </p>
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
        cif_mof_test.31.cif
        <CgClose className="absolute top-1/2 right-7 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer" />
      </div>
      <div className="h-full w-full px-6 pt-3 pb-0">
        <div className="w-full h-full relative">
          <HiOutlineZoomIn
            className="absolute z-10 right-0 top-0 text-xl text-gray-500 hover:text-gray-800 cursor-pointer bg-white rounded-bl-sm"
            onClick={zoomIn}
          />
          <MOFViz id="mole-1" />
        </div>
      </div>
      <div className="flex justify-center h-16 items-center">
        <div className="relative bg-gray-300 w-5/6 rounded-2xl text-center text-sm">
          <p className="invisible">PowerTubeSize</p>
          <div className="absolute h-full w-full left-0 top-0 z-10">
            <p>computing...</p>
          </div>
          <div className="absolute h-full w-1/2 bg-textHead left-0 top-0 rounded-l-2xl z-0"></div>
        </div>
      </div>
    </div>
  );
}

export default Card;
