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

  // Étape 1 : Fonction charger mise à jour pour utiliser Supabase (SELECT)
  const charger = async () => {
    setChargement(true);
    setErreur(null);

    // Remplacement du fetch par le pattern { data, error } de Supabase
    const { data, error } = await supabase
      .from("evenements")
      .select("*")
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

  // Fonction existante pour ajouter un événement en local (Sera adaptée à l'étape 2)
  const ajouterEvenement = (nouvel) => {
    setEvenements((precedents) => [nouvel, ...precedents]);
  };

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
        // Si non connecté : On affiche uniquement l'Auth (dans le BrowserRouter pour éviter le bug !)
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
            <Route
              path="/nouveau"
              element={<NouvelEvenement onAjouter={ajouterEvenement} />}
            />
            <Route
              path="/evenement/:id"
              element={<Detail evenements={evenements} />}
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;