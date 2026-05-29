import { Nav, Navbar, Button, Modal, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

export default function AppNavbar() {

    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const isLoggedIn = false; //temporary for testing

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
        <>
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

            {/* LOGIN MODAL */}
            <Modal show={showLogin} onHide={() => { setShowLogin(false); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="email"
                        placeholder="Email"
                        className="temporary idk not sure"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="i also dunno temporary"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <Button className="idk temp button" onClick={handleLogin}>Login</Button>
                </Modal.Body>
            </Modal>

            {/* SIGNUP MODAL */}
            <Modal show={showSignup} onHide={() => { setShowSignup(false); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        placeholder="Username"
                        className="idk temporary morte"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="idk temp"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="idk yyet"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}