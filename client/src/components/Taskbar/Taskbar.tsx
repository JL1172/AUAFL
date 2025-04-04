import { useMemo } from "react";
import { CiFileOn } from "react-icons/ci";
import { VscServerProcess } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import "./taskbar.scss";
export default function Taskbar() {
  const nav = useNavigate();
  const utilities = useMemo(() => {
    return [
      {
        name: "File Converter",
        click: () => nav("/file-page?title=File Converter Page"),
        icon: <CiFileOn style={{ width: "2rem", height: "2rem" }} />,
      },
      {
        name: "Task Viewer",
        click: () => nav("/task-viewer?title=Task Viewer Page"),
        icon: <VscServerProcess style={{ width: "2rem", height: "2rem" }} />,
      },
    ];
  }, []);
  return (
    <div className="task-bar">
      {utilities?.map((n, i) => {
        return (
          <div title = {n?.name} onClick={() => n?.click()} className="utility" key={i}>
            <span>{n?.icon}</span>
            <span>{n?.name}</span>
          </div>
        );
      })}
    </div>
  );
}
