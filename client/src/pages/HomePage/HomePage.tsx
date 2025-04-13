
import { useApp } from "../../contexts/AppSetupContext";
import "./home-page.scss";

export default function HomePage() {
  const {appName} = useApp()!;  
  return (
    <div className="home-page">
      <div className="main-screen">
        <h1 className="logo">{appName}</h1>
      </div>
    </div>
  );
}
