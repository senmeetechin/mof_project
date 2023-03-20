import GitHubLogo from "../assets/github-mark-white.svg";

function GitHub() {
  return (
    <div className="">
      <a
        href="https://github.com/senmeetechin/mof_project/tree/main/my-project"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={GitHubLogo}
          alt="GitHub"
          className="w-12 h-12 absolute right-10 top-10"
        />
      </a>
    </div>
  );
}

export default GitHub;
