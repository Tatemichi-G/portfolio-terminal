// react-router-dom
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import WorkPage from "./pages/WorkPage.jsx";


function App() {
  return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/works/:id" element={<WorkPage />} />
          <Route path="*" element={<h1>Not Found Page</h1>} />
        </Routes>
  )

}

export default App;
