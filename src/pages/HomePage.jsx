//react-bootstrap import(s)
import { Container, Row, Col, Button, Card } from "react-bootstrap";

//library import(s)
import { Link } from "react-router-dom";

//context import(s)
import { useUser } from "../context/UserContext";

//react icon import(s)
import { TbPlayCardStarFilled, TbStack3Filled, TbFoldersFilled } from "react-icons/tb";

//constants import(s)
import { SITE_NAME } from "../constants";

//style import(s)
import "../styles/home-page.css";


//information cards for guests about the app
const informationCards = [
    {
        icon: <TbPlayCardStarFilled size={22} />,
        title: "Prize Tracking",
        desc: "Calculate your current prize cards in real time and plan your game.",
    },
    {
        icon: <TbStack3Filled size={22} />,
        title: "Deck Builder",
        desc: "Build and save your decks the exact way you want them.",
    },
    {
        icon: <TbFoldersFilled size={22} />,
        title: "My Decks",
        desc: "Browse and review all your decks, edit them anytime you like.",
    }
];

//dont forget maybe make another constant variable to use in object like same title for both types of cards

//quick access cards shown only for logged in users
const quickAccessCards = [
    {
        icon: <TbPlayCardStarFilled size={22} />,
        title: "Prize Tracking",
        desc: "Start tracking your prize cards for your current game.",
        //TODO later update path to show specific deck currently being prize tracked
        path: "/decks/prize-tracking",
    },
    {
        icon: <TbStack3Filled size={22} />,
        title: "Deck Builder",
        desc: "Create and save your decks.",
        //TODO update to show in path specific deck being worked on
        path: "/decks/deck-builder",
    },
    {
        icon: <TbFoldersFilled size={22} />,
        title: "My Decks",
        desc: "View and manage all your decks.",
        path: "/decks",
    }
];

export default function HomePage() {
    //user context(s)
    const { user, userProfile, setShowLogin, setShowSignup, } = useUser();

    //user auth state(s)
    const isLoggedIn = !!user;

    return (
        <Container className="homepage-container">
            {isLoggedIn ? (
                //logged in view
                <>

                </>
            ) : (
                //guest view
                <>
                    <div className="text-center">
                        <h1>{SITE_NAME}</h1>
                        <p>Track your prize cards, manage your decks, and level up your Pokémon TCG game — all in one place.</p>
                        <Button onClick={() => { setShowSignup(true) }}>Sign up now!</Button>
                        <Button onClick={() => { setShowLogin(true) }}>Login here</Button>
                    </div>
                    <Row>
                        {informationCards.map((card) => (
                            <Col xs={12} sm={4} key={card.title}>
                                <Card>
                                    <Card.Body>
                                        {card.icon}
                                        <Card.Title>{card.title}</Card.Title>
                                        <Card.Text>{card.desc}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}