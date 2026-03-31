import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddInfluencer from "./pages/AddInfluencer.jsx";
import InfluencerPage from "./pages/InfluencerPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddInfluencer />} />
        <Route path="/i/:slug" element={<InfluencerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;