import { useState } from "react";
import EvenementCarte from "./components/EvenementCarte";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header"; // Import du Bonus
import styles from "./App.module.css";

const App = () => {
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [recherche, setRecherche] = useState("");

  const charger = async () => {
    setChargement(true);
    try {
      const reponse = await fetch("/evenements.json");
      const data = await reponse.json();
      setEvenements(data);
    } catch (error) {
      console.error("Erreur :", error);
    }
    setChargement(false);
  };

  const evenementsFiltres = evenements.filter((ev) =>
    ev.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Remplacement par le composant Header Bonus */}
      <Header
        onCharger={charger}
        chargement={chargement}
        nbResultats={evenementsFiltres.length}
      />

      <SearchBar valeur={recherche} onChangement={setRecherche} />

      {evenementsFiltres.map((ev) => (
        <EvenementCarte key={ev.id} ev={ev} afficherDetails={true} />
      ))}
    </div>
  );
};

export default App;