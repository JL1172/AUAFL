import { Route, Routes } from "react-router-dom";
import FilePage from "./pages/FilePage/FilePage";
import TaskViewerPage from "./pages/TaskViewerPage/TaskViewerPage";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import Taskbar from "./components/Taskbar/Taskbar";
import { AppSetupProvider } from "./context/AppSetupContext";

function App() {
  return (
    <AppSetupProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task-viewer" element={<TaskViewerPage />} />
          <Route path="/file-page" element={<FilePage />} />
          <Route />
        </Routes>
        <Taskbar />
      </div>
    </AppSetupProvider>
  );
}

export default App;
