//react-bootstrap import(s)
import { Card } from "react-bootstrap";

//library import(s)
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//constants import(s)
import { LEGAL_DECK_SIZE } from "../constants";

export default function DeckFolder({ deck }) {
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    //toggles dropdown and stops click bubbling to card
    function handleKebabClick(e) {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <Card className="decks-folder" onClick={() => navigate(`/decks/${deck.id}`)}>

            {/*banner with kebab button*/}
            <div style={{ backgroundColor: deck.colour, height: "80px", position: 'relative' }}>
                <button onClick={handleKebabClick} style={{ position: 'absolute', top: '8px', right: '8px' }}>⋮</button>

                {/*kebab dropdown menu*/}
                {dropdownOpen && (
                    <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '36px', right: '8px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', zIndex: 10 }}>
                        <div>Rename</div>
                        <div>Colour</div>
                        <div>Duplicate</div>
                        <div>Delete</div>
                    </div>
                )}
            </div>
            <Card.Body>
                {deck.cardCount !== LEGAL_DECK_SIZE && <span>Not Legal!</span>}
                <Card.Title>{deck.name}</Card.Title>
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