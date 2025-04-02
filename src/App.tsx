import { Route, Routes } from "react-router-dom"
import FilePage from "./pages/FilePage/FilePage"
import TaskViewerPage from "./pages/TaskViewerPage/TaskViewerPage"
import HomePage from "./pages/HomePage/HomePage"
import Header from "./components/Header/Header"
import Taskbar from "./components/Taskbar/Taskbar"

function App() {

  return (
    <div>
      <Header />
    <Routes>
      <Route path = "/" element = {<HomePage />}/>
      <Route path = "/task-viewer" element = {<TaskViewerPage />} />
      <Route path = "/file-page" element = {<FilePage />} />
      <Route />
    </Routes>
    <Taskbar />
    </div>
  ) 
}

export default App
