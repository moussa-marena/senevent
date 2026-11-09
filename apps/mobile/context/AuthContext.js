import {
    createContext, useContext, useState, useEffect,
} from "react";
import { getSupabase } from "@senevent/shared";

const AuthContext = createContext({ session: null, chargement: true });

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        // Récupérer la session au démarrage
        getSupabase().auth.getSession().then(({ data }) => {
            setSession(data.session);
            setChargement(false);
        });

        // Écouter les changements (login, logout, refresh)
        const { data: sub } = getSupabase().auth.onAuthStateChange(
            (_event, nouvelleSession) => setSession(nouvelleSession)
        );

        return () => sub.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, chargement }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}