import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getEvenements, getSupabase } from "@senevent/shared"; // Importation depuis le package partagé
import Auth from "./pages/Auth";
import Accueil from "./pages/Accueil";
import NouvelEvenement from "./pages/NouvelEvenement";
import Detail from "./pages/Detail";
import NavBar from "./components/NavBar";

const App = () => {
  // --- États pour la gestion des événements ---
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // --- États pour la gestion de l'authentification ---
  const [session, setSession] = useState(null);
  const [chargementSession, setChargementSession] = useState(true);

  // --- Chargement des événements via la fonction métier du package ---
  const charger = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const data = await getEvenements();
      setEvenements(data);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  // --- Gestion de la session Supabase via getSupabase() ---
  useEffect(() => {
    // 1. Récupérer la session active dès le chargement
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        setSession(data.session);
        setChargementSession(false);
      });

    // 2. Écouter en continu les changements d'état d'authentification
    const { data: subscription } = getSupabase().auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    // Déclencher le chargement initial des événements
    charger();

    // Nettoyage de l'abonnement
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Écran d'attente pendant que Supabase vérifie la session
  if (chargementSession) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#121212",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        Chargement de la session...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {!session ? (
        // Si non connecté : Affichage de la page d'authentification
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#121212",
          }}
        >
          <Auth />
        </div>
      ) : (
        // Si connecté : Affichage de l'application complète
        <>
          <NavBar session={session} />

          <Routes>
            <Route
              path="/"
              element={
                <Accueil
                  evenements={evenements}
                  chargement={chargement}
                  erreur={erreur}
                  onReessayer={charger}
                />
              }
            />
            <Route
              path="/nouveau"
              element={<NouvelEvenement onAjoutReussi={charger} />}
            />
            <Route
              path="/evenement/:id"
              element={<Detail evenements={evenements} session={session} />}
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;