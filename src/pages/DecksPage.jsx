//react-bootstrap import(s)
import { Container, Button, Row, Col, Form } from "react-bootstrap";

//library import(s)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//component import(s)
import DeckFolder from "../components/DeckFolder";
import LoadingSpinner from "../components/LoadingSpinner";

//firebase import(s)
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

//context import(s)
import { useUser } from "../context/UserContext";

//constants import(s)
import { TITLE_MY_DECKS } from "../constants";

//style import(s)
import "../styles/decks-page.css";

export default function DecksPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDecks, setSearchDecks] = useState("");

    //fetch decks from firestore on mount
    useEffect(() => {
        if (!user) return;

        async function fetchDecks() {
            try {
                const decksRef = collection(db, "users", user.uid, "decks");
                const decksSnap = await getDocs(decksRef);
                const decksList = decksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setDecks(decksList);
            } catch (err) {
                console.error("Error fetching decks:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDecks();
    }, [user]);

    //duplicates a deck by creating a new firestore doc
    async function handleDuplication(deck) {
        try {
            const decksRef = collection(db, "users", user.uid, "decks");
            const newDeckRef = await addDoc(decksRef, {
                name: `${deck.name} (copy)`,
                colour: deck.colour,
                createdAt: serverTimestamp(),
            });
            setDecks([...decks, { id: newDeckRef.id, name: `${deck.name} (copy)`, colour: deck.colour }]);
        } catch (err) {
            console.error("Error duplicating deck:", err);
        }
    }

    //deletes a deck from firestore
    async function handleDeletion(deck) {
        try {
            await deleteDoc(doc(db, "users", user.uid, "decks", deck.id));
            setDecks(decks.filter((d) => d.id !== deck.id));
        } catch (err) {
            console.error("Error deleting deck:", err);
        }
    }

    if (loading) return <LoadingSpinner />;

    return (
        <Container className="pt-4">
            <Row>
                <Col>
                    <h1>{TITLE_MY_DECKS}</h1>
                </Col>
                <Col xs="auto">
                    <Button onClick={() => navigate(`/decks/new`)}>+ New Deck</Button>
                </Col>
            </Row>
            {/* Search Bar */}
            <Row className="mt-3">
                <Col xs={4}>
                    <Form.Control
                        placeholder="Search decks..."
                        value={searchDecks}
                        onChange={(e) => setSearchDecks(e.target.value)}
                    />
                </Col>
            </Row>
            {/* decks folder grid */}
            <Row className="mt-3">
                {decks
                    .filter((deck) => deck.name.toLowerCase().includes(searchDecks.toLowerCase()))
                    .map((deck) => (
                        <Col className="mb-4" xs={12} sm={4} key={deck.id}>
                            <DeckFolder
                                deck={deck}
                                onDuplicate={handleDuplication}
                                onDelete={handleDeletion}
                            />
                        </Col>
                    ))}
            </Row>
        </Container>
    );
}