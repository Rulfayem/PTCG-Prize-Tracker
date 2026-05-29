import { Nav, Navbar, Button, Modal, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

export default function AppNavbar() {

    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const isLoggedIn = "temporary idk yet";

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [username, setUsername] = useState("");

    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");

    //signup function
    const handleSignup = async () => {
        "temp";
    };

    //login function
    const handleLogin = async () => {
        "temp";
    };

    const handleLogout = async () => {
        "temp";
    };

    return (
        <Navbar className="ptcg-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <img
                        alt="PTCG Prize Tracker Logo"
                        src="/PTCG-Prize-Tracker-Favicon.png"
                        height="40"
                        width="40"
                        className="navbar-icon"
                    />
                    PTCG Prize Tracker
                </Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center gap-2">
                    {isLoggedIn ? (
                        <>
                            <span>{username}</span>
                            <Button onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => { setShowLogin(true) }}>Login</Button>
                            <Button onClick={() => { setShowSignup(true) }}>Signup</Button>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}