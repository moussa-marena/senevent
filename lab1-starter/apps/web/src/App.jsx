import { useState } from "react";
// Ajout de l'importation du composant extrait
import EvenementCarte from "./components/EvenementCarte";

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
    <div style={{ maxWidth: "700px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#1a3a5c" }}>SenEvent --- Événements à Dakar</h1>

      {/* Bouton dynamique piloté par l'état chargement */}
      <button onClick={charger} disabled={chargement}>
        {chargement ? "Chargement ..." : "Charger les événements"}
      </button>

      {/* Boucle map pour transformer chaque objet du tableau en composant visuel */}
      {evenements.map(ev => (
        <EvenementCarte key={ev.id} ev={ev} />
      ))}
    </div>
  );
};

export default App;