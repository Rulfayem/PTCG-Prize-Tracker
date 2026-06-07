//react-bootstrap import(s)
import { Container, Button } from "react-bootstrap";

//library import(s)
import { Link } from "react-router-dom";

//style import(s)
import "../styles/error-page.css";

const confusedPsyduckImage = "../confused-psyduck.gif";

export default function ErrorPage() {
    return (
        <Container className="error-container">
            <div className="d-flex flex-column align-items-center gap-3">
                <h1>Uh oh! Looks like Psyduck got confused...</h1>
                <h4>Error 404 - Page Not Found</h4>
                <img src={confusedPsyduckImage} />
                <Button className="button-gradient" as={Link} to="/">Go Home</Button>
            </div>
        </Container>
    );
}