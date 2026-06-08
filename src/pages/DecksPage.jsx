//react-bootstrap import(s)
import { Container, Button, Row, Col, Form } from "react-bootstrap";

//component import(s)
import DeckFolder from "../components/DeckFolder";

//style import(s)
import "../styles/decks-page.css";

const dummyDecks = [
    { id: '1', name: 'King psychic deck', colour: '#d8b4fe', cardCount: 58 },
    { id: '2', name: 'Fire aggro v2', colour: '#fed7aa', cardCount: 60 },
    { id: '3', name: 'Electric test build', colour: '#bbf7d0', cardCount: 45 },
];

export default function DecksPage() {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Decks</h1>
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
                {dummyDecks.map((deck) => (
                    <Col xs={12} sm={4} key={deck.id}>
                        <DeckFolder deck={deck} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}