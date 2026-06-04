import { useState } from "react";
// Importation des composants enfants
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
// Importation du CSS Module officiel du professeur
import styles from "./App.module.css";

const App = () => {
  // 1. Déclaration des états pour les événements, le statut de chargement et la recherche
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [recherche, setRecherche] = useState(""); // Nouvel état pour stocker la saisie

  // 2. Fonction asynchrone pour récupérer le fichier JSON
  const charger = async () => {
    setChargement(true);
    try {
      // "evenements.json" sans accent dans le dossier public
      const reponse = await fetch("/evenements.json");
      const data = await reponse.json();
      setEvenements(data); // Met à jour l'état avec les données reçues
    } catch (error) {
      console.error("Erreur :", error);
    }
    setChargement(false);
  };

  // 3. Logique de filtrage dynamique par titre (insensible à la casse)
  const evenementsFiltres = evenements.filter((ev) =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.titre}>SenEvent --- Événements à Dakar</h1>

      {/* Bouton dynamique piloté par l'état chargement avec la classe stylisée */}
      <button
        onClick={charger}
        disabled={chargement}
        className={styles.bouton}
      >
        {chargement ? "Chargement ..." : "Charger les événements"}
      </button>

      {/* Étape 4 : Barre de recherche connectée à son état (Lifting State Up) */}
      <SearchBar valeur={recherche} onChangement={setRecherche} />

      {/* Affichage du compteur à l'aide de la classe .compteur officielle du professeur */}
      {evenements.length > 0 && (
        <p className={styles.compteur}>
          {evenementsFiltres.length} événement(s) trouvé(s)
        </p>
      )}

      {/* Boucle map modifiée pour transformer uniquement le tableau filtré en composants visuels */}
      {evenementsFiltres.map((ev) => (
        <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
      ))}
    </div>
  );
};

export default App;