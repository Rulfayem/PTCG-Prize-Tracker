//library import(s)
import { Routes, Route } from "react-router-dom";

//component import(s)
import AppNavbar from "./components/Navbar";
import AppFooter from "./components/Footer";
import NewDeckRedirect from "./components/NewDeckRedirect";

//pages import(s)
import DeckEditorPage from "./pages/DeckEditorPage";
import DecksPage from "./pages/DecksPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import PrizeTrackingPage from "./pages/PrizeTrackingPage";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppNavbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/decks" element={<DecksPage />} />
          {/* TODO later update path to show specific deck currently being worked on */}
          <Route path="/decks/new" element={<NewDeckRedirect />} />
          <Route path="/decks/:deckId" element={<DeckEditorPage />} />
          {/* TODO later update path to show specific deck currently being prize tracked */}
          <Route path="/decks/prize-tracking/:deckId" element={<PrizeTrackingPage />} />
        </Routes>
      </div>
      <AppFooter />
    </div>
  );
}