import { Route, Routes } from "react-router-dom";
import TaskViewerPage from "./pages/TaskViewerPage/TaskViewerPage";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import Taskbar from "./components/Taskbar/Taskbar";
import { AppSetupProvider } from "./contexts/AppSetupContext";
import SensorsPage from "./pages/SensorsPage/SensorsPage";
import { SensorProvider } from "./contexts/SensorContext";

function App() {
  return (
    <AppSetupProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task-viewer" element={<TaskViewerPage />} />
          <Route
            path="/sensor-monitor"
            element={
              <SensorProvider>
                <SensorsPage />
              </SensorProvider>
            }
          />
          <Route />
        </Routes>
        <Taskbar />
      </div>
    </AppSetupProvider>
  );
}

export default App;
