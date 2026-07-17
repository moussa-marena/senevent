import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase"; // Importation du client Supabase
import Auth from "./pages/Auth"; // Importation de ta page d'authentification
import Accueil from "./pages/Accueil";
import NouvelEvenement from "./pages/NouvelEvenement";
import Detail from "./pages/Detail";
import NavBar from "./components/NavBar";

const App = () => {
  // --- États existants pour la gestion des événements ---
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // --- Nouveaux états pour la gestion de l'authentification Supabase ---
  const [session, setSession] = useState(null);
  const [chargementSession, setChargementSession] = useState(true);

  // Étape 1 & Étape 5 : Fonction charger mise à jour pour inclure la jointure profiles(nom)
  const charger = async () => {
    setChargement(true);
    setErreur(null);

    // .select("*, profiles(nom)") récupère les colonnes de l'événement ET le nom du créateur
    const { data, error } = await supabase
      .from("evenements")
      .select("*, profiles(nom)")
      .order("date_debut", { ascending: true }); // Trie par date croissante côté BDD

    if (error) {
      setErreur(error.message);
    } else {
      setEvenements(data);
    }
    setChargement(false);
  };

  // --- Gestion de la session Supabase ---
  useEffect(() => {
    // 1. Récupérer la session active dès le chargement de l'application
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChargementSession(false);
    });

    // 2. Écouter en continu les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Déclencher le chargement initial depuis Supabase
    charger();

    // Nettoyage de l'abonnement lors du démontage du composant
    return () => subscription.unsubscribe();
  }, []);

  // Écran d'attente pendant que Supabase vérifie si l'utilisateur est connecté
  if (chargementSession) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#121212",
        color: "#fff",
        fontFamily: "sans-serif"
      }}>
        Chargement de la session...
      </div>
    );
  }

  // --- Toutes les interfaces bénéficient maintenant du BrowserRouter ---
  return (
    <BrowserRouter>
      {!session ? (
        // Si non connecté : On affiche uniquement l'Auth
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#121212"
        }}>
          <Auth />
        </div>
      ) : (
        // Si connecté : On affiche l'application complète existante
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
            {/* Étape 2 : Remplacement de onAjouter par onAjoutReussi={charger} */}
            <Route
              path="/nouveau"
              element={<NouvelEvenement onAjoutReussi={charger} />}
            />
            {/* Étape 3 : Ajout de la prop session pour alimenter le BoutonInscription */}
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