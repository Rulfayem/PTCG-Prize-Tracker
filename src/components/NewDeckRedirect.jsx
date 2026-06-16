//library import(s)
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//firebase import(s)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

//context import(s)
import { useUser } from "../context/UserContext";

export default function NewDeckRedirect() {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        async function createDeck() {
            try {
                //creates a new deck doc under the current user's decks collection
                const decksRef = collection(db, "users", user.uid, "decks");
                const newDeck = await addDoc(decksRef, {
                    name: "New Deck",
                    colour: "#a78bfa",
                    createdAt: serverTimestamp(),
                });
                //redirects to respective new deck's editor page
                navigate(`/decks/${newDeck.id}`, { replace: true });
            } catch (err) {
                console.error("Error creating new deck:", err);
            }
        }
        createDeck();
    }, [user, navigate]);

    return null;
}