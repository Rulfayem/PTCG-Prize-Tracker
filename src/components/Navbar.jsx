//react-bootstreap import(s)
import { Nav, Navbar, Button, Modal, Container, Form } from "react-bootstrap";

//library import(s)
import { Link } from "react-router-dom";
import { useState } from "react";

//firebase import(s)
import { auth, db } from "../firebase.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

//context import(s)
import { useUser } from "../context/UserContext.jsx";

//constants import(s)
import { SITE_NAME, SITE_ICON } from "../constants.js";

//style import(s)
import "../styles/navbar.css";

export default function AppNavbar() {

    //user context(s)
    const { user, userProfile, showLogin, setShowLogin, showSignup, setShowSignup } = useUser();

    //user auth state(s)
    const isLoggedIn = !!user;

    //form input state(s)
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [username, setUsername] = useState("");

    //error state(s)
    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");

    //signup function
    const handleSignup = async () => {
        setSignupError("");

        if (!signupEmail || !signupPassword || !username) {
            return setSignupError("Please fill in all fields.");
        }

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
            const newUser = userCredentials.user;

            await setDoc(doc(db, "users", newUser.uid), {
                username: username,
                email: signupEmail
            });
            setSignupEmail("");
            setSignupPassword("");
            setUsername("");
            setSignupError("");
            setShowSignup(false);
        } catch (err) {
            setSignupError(err.message);
        }
    };

    //login function
    const handleLogin = async () => {
        setLoginError("");

        if (!loginEmail || !loginPassword) {
            return setLoginError("Please fill in all fields.");
        }

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setLoginEmail("");
            setLoginPassword("");
            setLoginError("");
            setShowLogin(false);
        } catch (err) {
            setLoginError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar className="ptcg-navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                        <img
                            alt="PTCG Prize Tracker Logo"
                            src={SITE_ICON}
                            height="40"
                            width="40"
                            className="navbar-icon"
                        />
                        {SITE_NAME}
                    </Navbar.Brand>
                    <Nav className="ms-auto d-flex align-items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <span>{userProfile?.username}</span>
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
                onHide={() => {
                    setShowLogin(false);
                    setLoginEmail("");
                    setLoginPassword("");
                    setLoginError("");
                }}
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
                onHide={() => {
                    setShowSignup(false);
                    setUsername("");
                    setSignupEmail("");
                    setSignupPassword("");
                    setSignupError("");
                }}
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