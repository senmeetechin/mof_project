import MOFViz from "./MOFViz";
import { CgClose } from "react-icons/cg";
import { HiOutlineZoomIn } from "react-icons/hi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Card() {
  const zoomIn = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      html: (
        <div className="grid grid-cols-2 pt-10 gap-5">
          <div className="border border-black h-80 relative">
            <MOFViz className="z-50" />
          </div>
          <div className="text-left flex flex-col mr-8">
            <p className="text-2xl font-bold font-fontHead">
              cif_mof_test.31.cif
            </p>
            <div className="bg-red-200 flex justify-between font-fontContent">
              <p>Molecular weight:</p>
              <p>188.05 u</p>
            </div>
            <div className="bg-red-200 flex justify-between font-fontContent">
              <p>Unit cell volume:</p>
              <p>1250.15 A3</p>
            </div>
          </div>
        </div>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: 800,
    });
  };
  return (
    <div className="relative flex flex-col h-full w-80 bg-white rounded-2xl">
      <div className="bg-gray-300 rounded-t-2xl text-center py-1 text-xl font-fontContent h-10 relative">
        cif_mof_test.31.cif
        <CgClose className="absolute top-1/2 right-7 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800" />
      </div>
      <div className="h-full w-full px-6 pt-3 pb-3">
        <div className="w-full h-full relative">
          <HiOutlineZoomIn
            className="absolute z-10 right-0 top-0 text-xl text-gray-500 hover:text-gray-800"
            onClick={zoomIn()}
          />
          <MOFViz />
        </div>
      </div>
      <div className="flex justify-center h-1/6 items-center">
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
