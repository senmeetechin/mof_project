import BackgroundImage from "../assets/bg-bottom.png";
import GitHubLogo from "../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

function Background() {
  return (
    <div className="absolute bg-bgColor h-full w-full -z-10">
      <a
        href="https://github.com/senmeetechin/mof_project"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={GitHubLogo}
          alt="GitHub"
          className="w-12 h-12 absolute right-10 top-10"
        />
      </a>
      <img
        src={BackgroundImage}
        alt="bg-img"
        className="w-full absolute bottom-0"
      />
    </div>
  );
}

export default Background;
