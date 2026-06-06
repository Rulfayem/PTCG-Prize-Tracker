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
        icon: <TbPlayCardStarFilled size={32} color="#667eea" />,
        title: "Prize Tracking",
        desc: "Calculate your current prize cards in real time and plan your game.",
    },
    {
        icon: <TbStack3Filled size={32} color="#667eea" />,
        title: "Deck Builder",
        desc: "Build and save your decks the exact way you want them.",
    },
    {
        icon: <TbFoldersFilled size={32} color="#667eea" />,
        title: "My Decks",
        desc: "Browse and review all your decks, edit them anytime you like.",
    }
];

//dont forget maybe make another constant variable to use in object like same title for both types of cards

//quick access cards shown only for logged in users
const quickAccessCards = [
    {
        icon: <TbPlayCardStarFilled size={32} color="#667eea" />,
        title: "Prize Tracking",
        desc: "Start tracking your prize cards for your current game.",
        //TODO later update path to show specific deck currently being prize tracked
        path: "/decks/prize-tracking",
    },
    {
        icon: <TbStack3Filled size={32} color="#667eea" />,
        title: "Deck Builder",
        desc: "Create and save your decks.",
        //TODO update to show in path specific deck being worked on
        path: "/decks/deck-builder",
    },
    {
        icon: <TbFoldersFilled size={32} color="#667eea" />,
        title: "My Decks",
        desc: "View and manage all your decks.",
        path: "/decks",
    }
];

//random taglines displayed for logged in users
const loginMessage = [
    "Prepare to dominate the gym floor!",
    "Every win gets you closer to greatness.",
    "Your battle strategy is about to level up.",
    "Unleash strength for a chance at victory.",
    "The path of Pokémon conquest starts now.",
    "Win with grit and strategic brilliance.",
    "Your destiny as a Pokémon trainer is here to be shaped.",
    "This is going to be super effective!",
    "Prepare for a critical hit!",
    "Your deck is waiting, trainer.",
    "Time to flip some prizes.",
    "Ready to take the W?",
    "Back into the fray!",
    "Your opponents won't know what hit them.",
    "Let's build something unbeatable.",
    "The prize cards won't track themselves.",
    "Your opponents will rue the day they met you.",
    "Trainers beware—the true champion seeks you out.",
    "Face your fears, master your Pokémon.",
    "From every win emerges untold power.",
    "I just ate a whole bottle of ketchup.",
    "Do you even Splash, bro?",
    "When you have lemons, you make lemonade; when you have Pokémon cards, you build great decks.",
    "Are you ready to blast off?",
];

//generate random welcome message
const randomMessage = loginMessage[Math.floor(Math.random() * loginMessage.length)];

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
                    <div className="text-center">
                        <h2 className="welcome-message">Welcome back, {userProfile?.username}!</h2>
                        <p className="tagline">{randomMessage}</p>
                    </div>
                    <Row className="qa-cards-row justify-content-center">
                        {quickAccessCards.map((card) => (
                            <Col xs={12} sm={3} key={card.title}>
                                <Card className="qa-card" as={Link} to={card.path}>
                                    <Card.Body>
                                        <div className="card-icon">
                                            {card.icon}
                                        </div>
                                        <Card.Title>{card.title}</Card.Title>
                                        <Card.Text>{card.desc}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            ) : (
                //guest view
                <>
                    <div className="text-center">
                        <h1 className="main-title">{SITE_NAME}</h1>
                        <p className="tagline">Track your prize cards, manage your decks, and level up your Pokémon TCG game — all in one place.</p>
                        <div className=" hero-buttons-row text-center d-flex gap-2 justify-content-center">
                            <Button className="hero-button-signup" onClick={() => { setShowSignup(true) }}>Sign up now!</Button>
                            <Button className="hero-button-login" onClick={() => { setShowLogin(true) }}>Login here</Button>
                        </div>
                    </div>
                    <Row className="info-cards-row justify-content-center">
                        {informationCards.map((card) => (
                            <Col xs={12} sm={3} key={card.title}>
                                <Card className=" info-card">
                                    <Card.Body>
                                        <div className="card-icon">
                                            {card.icon}
                                        </div>
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