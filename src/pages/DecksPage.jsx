//react-bootstrap import(s)
import { Container, Button, Row, Col, Form } from "react-bootstrap";

//library cimport(s)
import { useState } from "react";

//component import(s)
import DeckFolder from "../components/DeckFolder";

//constants import(s)
import { TITLE_MY_DECKS } from "../constants";

//style import(s)
import "../styles/decks-page.css";

const dummyDecks = [
    { id: '1', name: 'King psychic deck', colour: '#d8b4fe', cardCount: 58 },
    { id: '2', name: 'Fire aggro v2', colour: '#fed7aa', cardCount: 60 },
    { id: '3', name: 'Electric test build', colour: '#bbf7d0', cardCount: 45 },
];

export default function DecksPage() {

    const [decks, setDecks] = useState(dummyDecks);

    const handleDuplication = (deck) => {
        setDecks([...decks, { ...deck, id: Date.now().toString(), name: `${deck.name} (copy)` }]);
    };

    const handleDeletion = (deck) => {
        setDecks(decks.filter((existingDeck) => existingDeck.id !== deck.id));
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h1>{TITLE_MY_DECKS}</h1>
                </Col>
                <Col xs="auto">
                    <Button>+ New Deck</Button>
                </Col>
            </Row>
            <Row>
                <Col xs={4}>
                    <Form.Control placeholder="Search decks..." />
                </Col>
            </Row>
            <Row>
                {decks.map((deck) => (
                    <Col xs={12} sm={4} key={deck.id}>
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