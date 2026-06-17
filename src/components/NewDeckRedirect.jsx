//library import(s)
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//firebase import(s)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
//context import(s)
import { useUser } from "../context/UserContext";

export default function NewDeckRedirect() {
    const { user } = useUser();
    const navigate = useNavigate();
    const hasCreated = useRef(false);

    useEffect(() => {
        if (!user) return;
        if (hasCreated.current) return;
        hasCreated.current = true;

        async function createDeck() {
            try {
                const decksRef = collection(db, "users", user.uid, "decks");
                const newDeck = await addDoc(decksRef, {
                    name: "New Deck",
                    colour: "#a78bfa",
                    createdAt: serverTimestamp(),
                });
                navigate(`/decks/${newDeck.id}`, { replace: true });
            } catch (err) {
                console.error("Error creating new deck:", err);
            }
        }

        createDeck();
    }, [user, navigate]);

    return null;
}