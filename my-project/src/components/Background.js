import BackgroundImage from "../assets/bg-bottom.png";

function Background() {
  return (
    <div className="absolute bg-bgColor h-full w-full -z-10">
      <img
        src={BackgroundImage}
        alt="bg-img"
        className="w-full absolute bottom-0"
      />
    </div>
  );
}

export default Background;
