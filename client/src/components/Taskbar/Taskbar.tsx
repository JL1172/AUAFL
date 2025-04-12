import { useMemo } from "react";
import { VscServerProcess } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import "./taskbar.scss";
export default function Taskbar() {
  const nav = useNavigate();
  const utilities = useMemo(() => {
    return [
      {
        name: "Task Viewer",
        click: () => nav("/task-viewer?title=Task Viewer Page"),
        icon: <VscServerProcess style={{ width: "2rem", height: "2rem" }} />,
      },
      {
        name: "Sensor Monitor",
        click: () => nav("/sensor-monitor?title=Sensor Monitor Page"),
        icon: <VscServerProcess style={{ width: "2rem", height: "2rem" }} />,
      },
    ];
  }, []);
  return (
    <div className="task-bar">
      {utilities?.map((n, i) => {
        return (
          <div
            title={n?.name}
            onClick={() => n?.click()}
            className="utility"
            key={i}
          >
            <span>{n?.icon}</span>
            <span>{n?.name}</span>
          </div>
        );
      })}
    </div>
  );
}
