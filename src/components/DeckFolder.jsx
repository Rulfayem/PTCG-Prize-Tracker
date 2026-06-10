//react-bootstrap import(s)
import { Card, Form, Dropdown } from "react-bootstrap";

//library import(s)
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

//react icon import(s)
import { TbDotsVertical } from "react-icons/tb";

//constants import(s)
import { DECK_LEGALITY } from "../constants";

export default function DeckFolder({ deck, onDuplicate, onDelete }) {
    const navigate = useNavigate();

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(deck.name);
    const [deckColour, setDeckColour] = useState(deck.colour);
    const [showColourPicker, setShowColourPicker] = useState(false);

    const colourPickerRef = useRef(null);

    useEffect(() => {
        if (!showColourPicker) return;

        function handleClickOutside(e) {
            if (colourPickerRef.current && !colourPickerRef.current.contains(e.target)) {
                setShowColourPicker(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        //cleanup — removes listener when picker closes or component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColourPicker]);

    return (
        <Card
            className="decks-folder h-100"
            style={{ "--deck-colour": deckColour }}
            onClick={() => navigate(`/decks/${deck.id}`)}
        >
            {/*banner with kebab button*/}
            <div style={{ backgroundColor: deckColour, height: "50px", position: 'relative' }}>

                {/*kebab dropdown menu*/}
                <Dropdown onClick={(e) => e.stopPropagation()}>
                    <Dropdown.Toggle bsPrefix="kebab-toggle"><TbDotsVertical size={20} /></Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShowColourPicker(true)}>Colour</Dropdown.Item>
                        <Dropdown.Item onClick={() => setIsRenaming(true)}>Rename</Dropdown.Item>
                        <Dropdown.Item onClick={() => onDuplicate(deck)}>Duplicate</Dropdown.Item>
                        <Dropdown.Item onClick={() => onDelete(deck)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Card.Body>
                {deck.cardCount !== DECK_LEGALITY && <span className="not-legal-badge">Not Legal!</span>}
                {showColourPicker &&
                    <div ref={colourPickerRef} onClick={(e) => e.stopPropagation()}>
                        <HexColorPicker
                            color={deckColour}
                            onChange={setDeckColour}
                            onClick={(e) => e.stopPropagation()} />
                    </div>
                }
                {isRenaming ? (
                    <Form.Control
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === "Enter") setIsRenaming(false); }}
                    />
                ) : (
                    <Card.Title>{newName}</Card.Title>
                )}
                <Card.Text>{deck.cardCount} / 60 cards</Card.Text>

                {/*progress bar*/}
                <div className="progress-bar-container" style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                        backgroundColor: deckColour,
                        width: `${(deck.cardCount / 60) * 100}%`,
                        height: '6px',
                        borderRadius: '4px'
                    }}></div>
                </div>
            </Card.Body>
        </Card>
    );
}