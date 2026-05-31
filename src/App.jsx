//library import(s)
import { Routes, Route } from "react-router-dom";

//component import(s)
import AppNavbar from "./components/Navbar";

//pages import(s)
import DeckBuilderPage from "./pages/DeckBuilderPage";
import DecksPage from "./pages/DecksPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import PrizeTrackingPage from "./pages/PrizeTrackingPage";

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/decks" element={<DecksPage />} />
        {/* TODO later update path to show specific deck currently being worked on */}
        <Route path="/decks/deck-builder" element={<DeckBuilderPage />} />
        {/* TODO later update path to show specific deck currently being prize tracked */}
        <Route path="/decks/prize-tracking" element={<PrizeTrackingPage />} />
      </Routes>
    </>
  );
}