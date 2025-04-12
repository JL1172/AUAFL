import { Route, Routes } from "react-router-dom";
import TaskViewerPage from "./pages/TaskViewerPage/TaskViewerPage";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import Taskbar from "./components/Taskbar/Taskbar";
import { AppSetupProvider } from "./context/AppSetupContext";
import SensorsPage from "./pages/SensorsPage/SensorsPage";

function App() {
  return (
    <AppSetupProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task-viewer" element={<TaskViewerPage />} />
          <Route path="/sensor-monitor" element={<SensorsPage />} />
          <Route />
        </Routes>
        <Taskbar />
      </div>
    </AppSetupProvider>
  );
}

export default App;
