//react-bootstrap import(s)
import { Card, Form, Dropdown } from "react-bootstrap";

//library import(s)
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//constants import(s)
import { LEGAL_DECK } from "../constants";

export default function DeckFolder({ deck }) {
    const navigate = useNavigate();

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(deck.name);

    return (
        <Card className="decks-folder" onClick={() => navigate(`/decks/${deck.id}`)}>

            {/*banner with kebab button*/}
            <div style={{ backgroundColor: deck.colour, height: "80px", position: 'relative' }}>

                {/*kebab dropdown menu*/}
                <Dropdown onClick={(e) => e.stopPropagation()}>
                    <Dropdown.Toggle>⋮</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setIsRenaming(true)}>Rename</Dropdown.Item>
                        <Dropdown.Item>Colour</Dropdown.Item>
                        <Dropdown.Item>Duplicate</Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Card.Body>
                {deck.cardCount !== LEGAL_DECK && <span>Not Legal!</span>}
                {isRenaming ? (
                    <Form.Control value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === "Enter") setIsRenaming(false); }}
                    />
                ) : (
                    <Card.Title>{newName}</Card.Title>
                )}
                <Card.Text>{deck.cardCount} / 60 cards</Card.Text>

                {/*progress bar*/}
                <div style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                        backgroundColor: deck.colour,
                        width: `${(deck.cardCount / 60) * 100}%`,
                        height: '6px',
                        borderRadius: '4px'
                    }}></div>
                </div>
            </Card.Body>
        </Card>
    );
}