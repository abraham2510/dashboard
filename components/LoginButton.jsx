// components/LoginButton.jsx
"use client"

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";

export default function LoginButton() {
    const [user, setUser] = useState(null);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            setUser({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
            });
        } catch (err) {
            console.error("Login error:", err.message);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-2">
                    <img src={user.photo} alt="user" className="w-8 h-8 rounded-full" />
                    <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            ) : (
                <button onClick={login} className="btn btn-primary">
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
