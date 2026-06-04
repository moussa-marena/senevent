import { useState } from "react";
// Importation du composant extrait
import EvenementCarte from "./components/EvenementCarte";
// Importation du CSS Module officiel du professeur
import styles from "./App.module.css";

const App = () => {
  // 1. Déclaration des états pour les événements et le statut de chargement
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(false);

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

      {/* Boucle map pour transformer chaque objet du tableau en composant visuel */}
      {evenements.map(ev => (
        <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
      ))}
    </div>
  );
};

export default App;