import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import SentimentAnalysis from "./pages/SentimentAnalysis"
import SocialMedia from "./pages/SocialMedia"
import ChurnPrediction from "./pages/ChurnPrediction"
import FakeAnalysis from "./pages/FakeAnalysis"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sentimetryx.netlify.app/sen" element={<SentimentAnalysis />} />
        <Route path="sentimetryx.netlify.app/social" element={<SocialMedia />} />
        <Route path="sentimetryx.netlify.app/cp" element={<ChurnPrediction />} />
        <Route path="sentimetryx.netlify.app/fake" element={<FakeAnalysis />} />
        <Route path="sentimetryx.netlify.app/dash" element={<Dashboard />} />
        <Route path="sentimetryx.netlify.app/about" element={<About />} />
      </Routes>
    </>
  )
}

export default App
