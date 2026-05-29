import { Nav, Navbar, Button, Modal, Container, Form } from "react-bootstrap";
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
            <Modal
                show={showLogin}
                onHide={() => { setShowLogin(false); }}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </Form.Group>
                    {loginError && <p className="text-danger">{loginError}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleLogin}>Login</Button>
                </Modal.Footer>
            </Modal>

            {/* SIGNUP MODAL */}
            <Modal
                show={showSignup}
                onHide={() => { setShowSignup(false); }}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                        />
                    </Form.Group>
                    {signupError && <p className="text-danger">{signupError}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSignup}>Sign up</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}