/* eslint-disable react-refresh/only-export-components */

//library import(s)
import { createContext, useContext, useEffect, useState } from "react";

//firebase import(s)
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const UserContext = createContext(null);

//custom hook
export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {

    //user state(s)
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    //modal visibility state(s)
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    useEffect(() => {
        const stopListening = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                //user is logged in
                setUser(firebaseUser);

                try {
                    const docRef = doc(db, "users", firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                }
            } else {
                //user is logged out
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        })
        //clean up crew
        return () => stopListening();
    }, []);

    return (
        <UserContext.Provider value={{ user, userProfile, loading, showLogin, setShowLogin, showSignup, setShowSignup }}>
            {children}
        </UserContext.Provider>
    )
};