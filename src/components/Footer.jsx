//constants import(s)
import { SITE_NAME } from "../constants.js";

//style import(s)
import "../styles/footer.css";

export default function AppFooter() {
    return (
        <footer className="footer">© 2026 {SITE_NAME}</footer>
    );
}