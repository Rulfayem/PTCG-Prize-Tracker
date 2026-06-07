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

    //loading state(s)
    const [isLoading, setIsLoading] = useState(false);

    //error state(s)
    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");

    //signup function
    const handleSignup = async () => {
        setSignupError("");

        if (!signupEmail || !signupPassword || !username) {
            return setSignupError("Please fill in all fields.");
        }

        if (username.length < 2) {
            return setSignupError("Username is too short.");
        } else if (username.length > 18) {
            return setSignupError("Username is too long.");
        } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return setSignupError("Username can only contain letters, numbers, underscores and hyphens.");
        }

        setIsLoading(true);

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
            const newUser = userCredentials.user;

            await setDoc(doc(db, "users", newUser.uid), {
                username: username,
                email: signupEmail
            });
            setIsLoading(false);
            setSignupEmail("");
            setSignupPassword("");
            setUsername("");
            setSignupError("");
            setShowSignup(false);
        } catch (err) {
            if (err.code === "auth/invalid-email") {
                setSignupError("Please enter a valid email address.");
            }
            else if (err.code === "auth/invalid-credential") {
                setSignupError("Incorrect email or password.");
            }
            else {
                setSignupError("Something went wrong. Please try again.");
            }
            setIsLoading(false);
        }
    };

    //login function
    const handleLogin = async () => {
        setLoginError("");

        if (!loginEmail || !loginPassword) {
            return setLoginError("Please fill in all fields.");
        }

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            setIsLoading(false);
            setLoginEmail("");
            setLoginPassword("");
            setLoginError("");
            setShowLogin(false);
        } catch (err) {
            if (err.code === "auth/invalid-email") {
                setLoginError("Please enter a valid email address.");
            }
            else if (err.code === "auth/invalid-credential") {
                setLoginError("Incorrect email or password.");
            }
            else {
                setLoginError("Something went wrong. Please try again.");
            }
            setIsLoading(false);
        }
    }

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
                <Container fluid className="px-5">

                    {/* left side of navbar - site icon and name */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                        <img
                            alt="PTCG Prize Tracker Logo"
                            src={SITE_ICON}
                            height="40"
                            width="40"
                            className="navbar-icon"
                        />
                        <span className="navbar-site-name">{SITE_NAME}</span>
                    </Navbar.Brand>

                    {/* right side of navbar - username and buttons */}
                    <Nav className="ms-auto d-flex align-items-center gap-2">
                        {isLoggedIn ? (
                            <>
                                <span className="navbar-username">{userProfile?.username}</span>
                                <Button className="button-gradient" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button className="button-gradient" onClick={() => { setShowLogin(true) }}>Login</Button>
                                <Button className="button-gradient" onClick={() => { setShowSignup(true) }}>Signup</Button>
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
                            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                        />
                    </Form.Group>
                    {loginError && <p className="text-danger">{loginError}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
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
                            onKeyDown={(e) => { if (e.key === "Enter") handleSignup(); }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSignup(); }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSignup(); }}
                        />
                    </Form.Group>
                    {signupError && <p className="text-danger">{signupError}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSignup} disabled={isLoading}>
                        {isLoading ? "Signing up..." : "Sign up"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}