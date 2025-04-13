import { VscTerminalLinux } from "react-icons/vsc";
import "./header.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppSetupContext";
export default function Header() {
  const nav = useNavigate();
  const { search } = useLocation();
const {appName} = useApp()!;
  return (
    <div className="header">
      <div
        title="Home"
        className="click"
        onClick={() => {
          nav("/");
        }}
      >
        <VscTerminalLinux style={{ width: "1rem", height: "1rem" }} />
        <h1>{appName}</h1>
      </div>
      <div className="location">
        {search
          ?.split("?title=")
          ?.[search?.split("?title=")?.length - 1]?.replace(/%20/g, " ")}
      </div>
    </div>
  );
}
