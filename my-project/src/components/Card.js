import MOFViz from "./MOFViz";

function Card() {
  return (
    <div className="relative flex flex-col h-full w-80 bg-white rounded-2xl">
      <div className="bg-gray-300 rounded-t-2xl text-center py-1 text-xl font-fontContent">
        cif_mof_test.31.cif
      </div>
      <div className="h-full w-full px-6 pt-8 pb-3">
        <div className="border border-black w-full h-full relative"><MOFViz/></div>
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
