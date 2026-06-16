//react-bootstrap import(s)
import { Card, Form, Dropdown } from "react-bootstrap";

//library import(s)
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";

//firebase import(s)
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

//react icon import(s)
import { TbDotsVertical } from "react-icons/tb";

//constants import(s)
import { DECK_LEGALITY } from "../constants";

export default function DeckFolder({ deck, onDuplicate, onDelete, userId }) {
    const navigate = useNavigate();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(deck.name);
    const [deckColour, setDeckColour] = useState(deck.colour);
    const [showColourPicker, setShowColourPicker] = useState(false);
    const [cardCount, setCardCount] = useState(0);
    const colourPickerRef = useRef(null);

    //fetch real card count from cards subcollection
    useEffect(() => {
        if (!userId) return;

        async function fetchCardCount() {
            try {
                const cardsRef = collection(db, "users", userId, "decks", deck.id, "cards");
                const cardsSnap = await getDocs(cardsRef);
                const total = cardsSnap.docs.reduce((sum, d) => sum + (d.data().quantity ?? 0), 0);
                setCardCount(total);
            } catch (err) {
                console.error("Error fetching card count:", err);
            }
        }
        fetchCardCount();
    }, [userId, deck.id]);

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

    //saves renamed deck to firestore
    async function handleRename() {
        if (!newName.trim()) return;
        try {
            const deckRef = doc(db, "users", userId, "decks", deck.id);
            await updateDoc(deckRef, { name: newName.trim() });
        } catch (err) {
            console.error("Error renaming deck:", err);
        }
        setIsRenaming(false);
    }

    //saves new colour to firestore
    async function handleColourClose() {
        try {
            const deckRef = doc(db, "users", userId, "decks", deck.id);
            await updateDoc(deckRef, { colour: deckColour });
        } catch (err) {
            console.error("Error saving colour:", err);
        }
        setShowColourPicker(false);
    }

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
            <Card.Body onClick={(e) => { e.stopPropagation(); navigate(`/decks/${deck.id}`); }}>
                {cardCount !== DECK_LEGALITY && <span className="not-legal-badge">Not Legal!</span>}
                {showColourPicker &&
                    <div ref={colourPickerRef} onClick={(e) => e.stopPropagation()}>
                        <HexColorPicker
                            color={deckColour}
                            onChange={setDeckColour}
                        />
                        <button onClick={handleColourClose} style={{ marginTop: "8px", width: "100%" }}>Done</button>
                    </div>
                }
                {isRenaming ? (
                    <Form.Control
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
                        onBlur={handleRename}
                    />
                ) : (
                    <Card.Title>{newName}</Card.Title>
                )}
                <Card.Text>{cardCount} / 60 cards</Card.Text>
                {/*progress bar*/}
                <div className="progress-bar-container" style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                        backgroundColor: deckColour,
                        width: `${(cardCount / 60) * 100}%`,
                        height: '6px',
                        borderRadius: '4px'
                    }}></div>
                </div>
            </Card.Body>
        </Card>
    );
}