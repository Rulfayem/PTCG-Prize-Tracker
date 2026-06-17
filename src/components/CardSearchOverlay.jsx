/* eslint-disable */

//react-bootstrap import(s)
import { Container, Row, Col, Form, Button } from "react-bootstrap";

//library import(s)
import { useState, useEffect } from "react";

//component import(s)
import LoadingSpinner from "./LoadingSpinner";

//react icon import(s)
import { TbX, TbEye } from "react-icons/tb";

export default function CardSearchOverlay({ show, onClose, onAddCard, onRemoveCard, deckCards }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    //search TCGdex API when query changes with small delay so it doesn't fire on every keystroke
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(query)}`);
                const data = await res.json();

                //filters out cards with no image
                setResults(Array.isArray(data) ? data.filter((c) => c.image) : []);
            } catch (err) {
                console.error("Error searching cards:", err);
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 400);
        return () => clearTimeout(delay);
    }, [query]);

    //quantify how many of a certain card is already in the deck
    function getQuantity(cardId) {
        const sameCard = deckCards.find((c) => c.tcgId === cardId);
        return sameCard ? sameCard.quantity : 0;
    }

    if (!show) return null;

    return (
        <div style={{
            position: "fixed",
            top: "24px", left: "24px", right: "24px", bottom: "24px",
            backgroundColor: "rgba(221, 228, 240, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1050,
            overflowY: "auto",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}>
            <Container className="pt-4 pb-5">
                {/* header row */}
                <Row className="align-items-center mb-4">
                    <Col>
                        <h2 className="mb-0">Add Cards</h2>
                    </Col>
                    <Col xs="auto">
                        {/* TODO: transparency toggle button (future) */}
                        <Button variant="outline-secondary" className="me-2" disabled>
                            <TbEye />
                        </Button>
                        <Button variant="outline-danger" onClick={onClose}>
                            <TbX />
                        </Button>
                    </Col>
                </Row>

                {/* search bar */}
                <Row className="mb-4">
                    <Col xs={12} md={6}>
                        <Form.Control
                            placeholder="Search cards by name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </Col>
                </Row>

                {/* loading spinner */}
                {searching && (
                    <Row className="mb-3">
                        <Col className="text-center"><LoadingSpinner /></Col>
                    </Row>
                )}

                {/* failed/no results card search */}
                {!searching && query.trim() && results.length === 0 && (
                    <p className="text-muted">No cards found for "{query}".</p>
                )}

                {/* results grid + selected card panel */}
                {results.length > 0 && (
                    <Row>
                        {/* card grid */}
                        <Col xs={12} md={selectedCard ? 7 : 12}>
                            <Row>
                                {results.map((card) => {
                                    const qty = getQuantity(card.id);
                                    return (
                                        <Col key={card.id} xs={6} sm={4} md={3} className="mb-4">
                                            <div style={{ position: "relative", textAlign: "center" }}>
                                                {/* card image - click to open full view */}
                                                <img
                                                    src={`${card.image}/low.webp`}
                                                    alt={card.name}
                                                    style={{
                                                        width: "100%",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        border: selectedCard?.id === card.id ? "2px solid var(--bs-primary)" : "2px solid transparent",
                                                    }}
                                                    onClick={() => setSelectedCard(card)}
                                                />
                                                {/* +/- controls */}
                                                <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => onRemoveCard(card)}
                                                        disabled={qty === 0}
                                                    >-</Button>
                                                    <span>{qty}</span>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => onAddCard(card)}
                                                    >+</Button>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Col>

                        {/* selected card full view */}
                        {selectedCard && (
                            <Col xs={12} md={5}>
                                <div style={{ position: "sticky", top: "20px", textAlign: "center" }}>
                                    <img
                                        src={`${selectedCard.image}/high.webp`}
                                        alt={selectedCard.name}
                                        style={{ width: "100%", maxWidth: "300px", borderRadius: "12px" }}
                                    />
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => onRemoveCard(selectedCard)}
                                            disabled={getQuantity(selectedCard.id) === 0}
                                        >-</Button>
                                        <span style={{ fontSize: "1.2rem" }}>{getQuantity(selectedCard.id)}</span>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => onAddCard(selectedCard)}
                                        >+</Button>
                                    </div>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => setSelectedCard(null)}
                                    >Close</Button>
                                </div>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}