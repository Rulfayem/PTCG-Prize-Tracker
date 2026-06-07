//library import(s)
import { Link } from "react-router-dom";

//style import(s)
import "../styles/error-page.css";

const confusedPsyduckImage = "../confused-psyduck.gif";

export default function ErrorPage() {
    return (
        <div className="error-page-wrapper">
            <div className="d-flex flex-column align-items-center gap-3">
                <h1 className="error-title">Uh oh! Looks like Psyduck got confused...</h1>
                <h4 className="error-subtitle">Error 404 - Page Not Found</h4>
                <Link to="/">
                    <img className="psyduck-link-home" src={confusedPsyduckImage} width="550px" />
                </Link>
                <p className="psyduck-hint">Click on Psyduck to return home!</p>
            </div>
        </div>
    );
}