//react-bootstrap import(s)
import { Container, Row, Col, Badge, Button } from "react-bootstrap";

//library import(s)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//component import(s)
import LoadingSpinner from "../components/LoadingSpinner";

//firebase import(s)
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

//context import(s)
import { useUser } from "../context/UserContext";

//constants import(s)
import { CATEGORY_SORT_ORDER } from "../constants";

export default function DeckEditorPage() {
    const { deckId } = useParams();
    const { user } = useUser();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <Col><h1 className="mb-0">{deck.name}</h1></Col>
                <Col xs="auto">
                    <Button className="button-gradient">+ Add Cards</Button>
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

            {/* cards list */}
            {sortedCards.length === 0 ? (
                <p className="text-muted">No cards yet. Hit "+ Add Cards" to get started.</p>
            ) : (
                <Row>
                    {sortedCards.map((card) => (
                        <Col key={card.id} xs={12} className="mb-2">
                            <Row className="align-items-center">
                                <Col xs="auto">
                                    {/* card image preview */}
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        style={{ height: "60px", borderRadius: "4px" }}
                                    />
                                </Col>
                                <Col>
                                    <strong>{card.name}</strong>
                                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>{card.category}</div>
                                </Col>
                                <Col xs="auto" className="d-flex align-items-center gap-2">
                                    <Button variant="outline-secondary" size="sm">-</Button>
                                    <span>{card.quantity}</span>
                                    <Button variant="outline-secondary" size="sm">+</Button>
                                    <Button variant="outline-danger" size="sm">✕</Button>
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}