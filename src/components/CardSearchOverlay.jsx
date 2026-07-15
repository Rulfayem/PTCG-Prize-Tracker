/* eslint-disable */

//react-bootstrap import(s)
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";

//library import(s)
import { useState, useEffect } from "react";

//component import(s)
import LoadingSpinner from "./LoadingSpinner";

//react icon import(s)
import { TbX, TbEye } from "react-icons/tb";

//style import(s)
import "../styles/deck-editor-page.css";

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
            backgroundColor: "rgba(221, 228, 240, 0.80)",
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

                {/* results grid */}
                {results.length > 0 && (
                    <Row>
                        {results.map((card) => {
                            const qty = getQuantity(card.id);
                            return (
                                <Col key={card.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                                    <div style={{ position: "relative", textAlign: "center", overflow: "visible" }}>
                                        {/* quantity badge */}
                                        {qty > 0 && (
                                            <div style={{
                                                position: "absolute",
                                                top: "-8px",
                                                right: "-8px",
                                                backgroundColor: "rgba(0,0,0,0.7)",
                                                color: "white",
                                                borderRadius: "50%",
                                                width: "24px",
                                                height: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                zIndex: 1,
                                            }}>{qty}</div>
                                        )}
                                        {/* card image - click to open full view */}
                                        <img
                                            src={`${card.image}/low.webp`}
                                            alt={card.name}
                                            className="card-hoverable"
                                            style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }}
                                            onClick={() => setSelectedCard(card)}
                                        />
                                        {/* +/- controls */}
                                        <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                                            <Button
                                                className="button-gradient"
                                                size="sm"
                                                style={{ padding: "1px 10px", fontWeight: "700", fontSize: "1rem" }}
                                                onClick={() => onRemoveCard(card)}
                                                disabled={qty === 0}
                                            >-</Button>
                                            <span>{qty}</span>
                                            <Button
                                                className="button-gradient"
                                                size="sm"
                                                style={{ padding: "1px 10px", fontWeight: "700", fontSize: "1rem" }}
                                                onClick={() => onAddCard(card)}
                                            >+</Button>
                                        </div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>

            {/* card full view modal */}
            <Modal show={!!selectedCard} onHide={() => setSelectedCard(null)} centered contentClassName="bg-transparent border-0 shadow-none">
                <Modal.Body className="text-center p-0">
                    {selectedCard && (
                        <>
                            <img
                                src={`${selectedCard.image}/high.webp`}
                                alt={selectedCard.name}
                                style={{ width: "100%", maxWidth: "450px", borderRadius: "12px" }}
                            />
                            <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                                <Button
                                    className="button-gradient"
                                    style={{ padding: "1px 10px", fontWeight: "700", fontSize: "1rem" }}
                                    onClick={() => onRemoveCard(selectedCard)}
                                    disabled={getQuantity(selectedCard.id) === 0}
                                >-</Button>
                                <span style={{ color: "white", fontSize: "1.2rem", fontWeight: "700" }}>
                                    {getQuantity(selectedCard.id)}
                                </span>
                                <Button
                                    className="button-gradient"
                                    style={{ padding: "1px 10px", fontWeight: "700", fontSize: "1rem" }}
                                    onClick={() => onAddCard(selectedCard)}
                                >+</Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}