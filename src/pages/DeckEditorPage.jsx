//react-bootstrap import(s)
import { Container, Row, Col, Badge, Button, Form, Modal } from "react-bootstrap";

//library import(s)
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//component import(s)
import LoadingSpinner from "../components/LoadingSpinner";
import CardSearchOverlay from "../components/CardSearchOverlay";

//react icon import(s)
import { TbPencil } from "react-icons/tb";

//firebase import(s)
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

//context import(s)
import { useUser } from "../context/UserContext";

//constants import(s)
import { CATEGORY_SORT_ORDER } from "../constants";

export default function DeckEditorPage() {
    const navigate = useNavigate();
    const { deckId } = useParams();
    const { user } = useUser();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isRenamingDeck, setIsRenamingDeck] = useState(false);
    const [newDeckName, setNewDeckName] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function fetchDeck() {
            try {
                //fetch the deck DOCUMENT
                const deckRef = doc(db, "users", user.uid, "decks", deckId);
                const deckSnap = await getDoc(deckRef);

                if (deckSnap.exists()) {
                    setDeck({ id: deckSnap.id, ...deckSnap.data() });
                } else {
                    console.error("Deck not found");
                    setLoading(false);
                    return;
                }

                //fetch the cards subcollection
                const cardsRef = collection(db, "users", user.uid, "decks", deckId, "cards");
                const cardsSnap = await getDocs(cardsRef);
                const cardsList = cardsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setCards(cardsList);
            } catch (err) {
                console.error("Error fetching deck:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDeck();
    }, [user, deckId]);

    //adds a card to the deck or increments quantity if already present
    async function handleAddCard(tcgCard) {
        const existing = cards.find((c) => c.tcgId === tcgCard.id);
        try {
            if (existing) {
                //card already in deck - just increment quantity
                const cardRef = doc(db, "users", user.uid, "decks", deckId, "cards", existing.id);
                await updateDoc(cardRef, { quantity: existing.quantity + 1 });
                setCards(cards.map((c) => c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c));
            } else {
                //fetch full card details from TCGdex API to get category, stage, trainerType
                const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${tcgCard.id}`);
                const fullCard = await res.json();

                const cardsRef = collection(db, "users", user.uid, "decks", deckId, "cards");
                const newCardRef = await addDoc(cardsRef, {
                    tcgId: tcgCard.id,
                    name: tcgCard.name,
                    image: tcgCard.image,
                    category: fullCard.category ?? null,
                    stage: fullCard.stage ?? null,
                    trainerType: fullCard.trainerType ?? null,
                    quantity: 1,
                });
                setCards([...cards, {
                    id: newCardRef.id,
                    tcgId: tcgCard.id,
                    name: tcgCard.name,
                    image: tcgCard.image,
                    category: fullCard.category ?? null,
                    stage: fullCard.stage ?? null,
                    trainerType: fullCard.trainerType ?? null,
                    quantity: 1,
                }]);
            }
        } catch (err) {
            console.error("Error adding card:", err);
        }
    }

    //removes a card or decrements quantity
    async function handleRemoveCard(tcgCard) {
        const existing = cards.find((c) => c.tcgId === tcgCard.id);
        if (!existing) return;
        try {
            const cardRef = doc(db, "users", user.uid, "decks", deckId, "cards", existing.id);
            if (existing.quantity > 1) {
                //decrements quantity
                await updateDoc(cardRef, { quantity: existing.quantity - 1 });
                setCards(cards.map((c) => c.id === existing.id ? { ...c, quantity: c.quantity - 1 } : c));
            } else {
                //if quantity is 1, remove the card doc entirely
                await deleteDoc(cardRef);
                setCards(cards.filter((c) => c.id !== existing.id));
            }
        } catch (err) {
            console.error("Error removing card:", err);
        }
    }

    //completely obliterates a card from existence from the deck regardless of quantity
    async function handleDeleteCard(card) {
        const existing = cards.find((c) => c.tcgId === card.tcgId);
        if (!existing) return;
        try {
            const cardRef = doc(db, "users", user.uid, "decks", deckId, "cards", existing.id);
            await deleteDoc(cardRef);
            setCards(cards.filter((c) => c.id !== existing.id));
        } catch (err) {
            console.error("Error deleting card:", err);
        }
    }

    //renames the deck in firestore
    async function handleRenameDeck(name) {
        if (!name.trim()) return;
        try {
            const deckRef = doc(db, "users", user.uid, "decks", deckId);
            await updateDoc(deckRef, { name: name.trim() });
            setDeck({ ...deck, name: name.trim() });
            setIsRenamingDeck(false);
        } catch (err) {
            console.error("Error renaming deck:", err);
        }
    }

    //calculates quick stats from the cards list
    const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0);
    const pokemonCount = cards.filter((c) => c.category === "Pokemon").reduce((sum, c) => sum + c.quantity, 0);
    const basicPokemonCount = cards.filter((c) => c.category === "Pokemon" && c.stage === "Basic").reduce((sum, c) => sum + c.quantity, 0);
    const supporterCount = cards.filter((c) => c.trainerType === "Supporter").reduce((sum, c) => sum + c.quantity, 0);
    const energyCount = cards.filter((c) => c.category === "Energy").reduce((sum, c) => sum + c.quantity, 0);

    //sort cards: pokemon first, then trainers, then energy, then by order added
    const sortedCards = [...cards].sort((a, b) => {
        const aOrder = CATEGORY_SORT_ORDER[a.category] ?? 99;
        const bOrder = CATEGORY_SORT_ORDER[b.category] ?? 99;
        return aOrder - bOrder;
    });

    if (loading) return <LoadingSpinner />;
    if (!deck) return <div>Deck not found.</div>;

    return (
        <Container className="pt-4">
            <Row className="align-items-center mb-3">
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={() => navigate("/decks")}>← Back</Button>
                </Col>
                <Col>
                    {isRenamingDeck ? (
                        <Form.Control
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleRenameDeck(newDeckName); }}
                            onBlur={() => handleRenameDeck(newDeckName)}
                            autoFocus
                            style={{ width: `${Math.max(newDeckName.length, 10)}ch`, minWidth: "200px" }}
                        />
                    ) : (
                        <h1 className="mb-0" style={{ cursor: "pointer" }} onClick={() => { setNewDeckName(deck.name); setIsRenamingDeck(true); }}>
                            {deck.name} <TbPencil size={20} style={{ opacity: 0.4 }} />
                        </h1>
                    )}
                </Col>
                <Col xs="auto">
                    <Button className="button-gradient" onClick={() => setShowOverlay(true)}>+ Add Cards</Button>
                </Col>
            </Row>

            {/* stats bar */}
            <Row className="mb-4">
                <Col xs="auto"><Badge bg="secondary">Total: {totalCards} / 60</Badge></Col>
                <Col xs="auto"><Badge bg="warning" text="dark">Pokémon: {pokemonCount}</Badge></Col>
                <Col xs="auto"><Badge bg="success">Basic: {basicPokemonCount}</Badge></Col>
                <Col xs="auto"><Badge bg="info" text="dark">Supporters: {supporterCount}</Badge></Col>
                <Col xs="auto"><Badge bg="danger">Energy: {energyCount}</Badge></Col>
            </Row>

            {/* cards grid */}
            {sortedCards.length === 0 ? (
                <p className="text-muted">No cards yet. Hit "+ Add Cards" to get started.</p>
            ) : (
                <Row>
                    {sortedCards.map((card) => (
                        <Col key={card.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
                            <div style={{ position: "relative", textAlign: "center", overflow: "visible" }}>

                                {/* quantity badge on top corner */}
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
                                }}>{card.quantity}</div>

                                {/* card image - click to open full view */}
                                <img
                                    src={`${card.image}/low.webp`}
                                    alt={card.name}
                                    style={{ width: "100%", borderRadius: "8px", cursor: "pointer" }}
                                    onClick={() => setSelectedCard(card)}
                                />

                                {/* +/- /delete controls */}
                                <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleRemoveCard({ id: card.tcgId })}>-</Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleAddCard({ id: card.tcgId, name: card.name, image: card.image, category: card.category, stage: card.stage, trainerType: card.trainerType })}>+</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCard(card)}>✕</Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* card full view modal */}
            <Modal show={!!selectedCard} onHide={() => setSelectedCard(null)} centered contentClassName="bg-transparent border-0 shadow-none">
                <Modal.Body className="text-center p-0">
                    {selectedCard && (
                        <img
                            src={`${selectedCard.image}/high.webp`}
                            alt={selectedCard.name}
                            style={{ width: "100%", maxWidth: "450px", borderRadius: "12px" }}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* card search overlay */}
            <CardSearchOverlay
                show={showOverlay}
                onClose={() => setShowOverlay(false)}
                onAddCard={handleAddCard}
                onRemoveCard={handleRemoveCard}
                deckCards={cards}
            />
        </Container>
    );
}