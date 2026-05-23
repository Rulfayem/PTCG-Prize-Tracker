//library imports
import { Routes, Route } from "react-router-dom";

//component imports
import Navbar from "./components/Navbar";

//pages imports
import DeckBuilderPage from "./pages/DeckBuilderPage";
import DecksPage from "./pages/DecksPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import PrizeTrackingPage from "./pages/PrizeTrackingPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/decks/deck-builder" element={<DeckBuilderPage />} />
        <Route path="/decks/prize-tracking" element={<PrizeTrackingPage />} />
      </Routes>
    </>
  );
}