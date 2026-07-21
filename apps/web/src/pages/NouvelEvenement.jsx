import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { creerEvenement, getSupabase } from "@senevent/shared";
import styles from "./NouvelEvenement.module.css";

const NouvelEvenement = ({ onAjoutReussi }) => {
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("concert");
  const [lieu, setLieu] = useState("");
  const [prix, setPrix] = useState(0);
  const [erreurs, setErreurs] = useState({});
  const [erreurServeur, setErreurServeur] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const navigate = useNavigate();

  const valider = () => {
    const e = {};
    if (titre.trim().length < 3) {
      e.titre = "Le titre doit contenir au moins 3 caracteres.";
    }
    if (lieu.trim().length < 2) {
      e.lieu = "Le lieu est requis.";
    }
    if (prix < 0) {
      e.prix = "Le prix ne peut pas etre negatif.";
    }
    return e;
  };

  const soumettre = async (event) => {
    event.preventDefault();
    setErreurServeur(null);
    const erreursTrouvees = valider();
    if (Object.keys(erreursTrouvees).length > 0) {
      setErreurs(erreursTrouvees);
      return;
    }
    setEnCours(true);

    try {
      // 1. Récupérer l'utilisateur connecté via getSupabase()
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) {
        setErreurServeur("Vous devez etre connecte.");
        setEnCours(false);
        return;
      }

      // 2. Appel de la fonction métier du package
      await creerEvenement({
        titre: titre.trim(),
        categorie,
        lieu_nom: lieu.trim(),
        prix: Number(prix),
        date_debut: new Date().toISOString(),
        organisateur_id: user.id,
      });

      onAjoutReussi(); // Demande à App de recharger la liste (Re-fetch)
      navigate("/");
    } catch (error) {
      setErreurServeur(error.message);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Créer un nouvel événement</h2>
      <form onSubmit={soumettre} className={styles.formulaire}>
        <div className={styles.champ}>
          <label>Titre de l'événement</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
          {erreurs.titre && <span className={styles.erreurTxt}>{erreurs.titre}</span>}
        </div>

        <div className={styles.champ}>
          <label>Catégorie</label>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="concert">Concert</option>
            <option value="sport">Sport</option>
            <option value="conference">Conférence</option>
            <option value="festival">Festival</option>
          </select>
        </div>

        <div className={styles.champ}>
          <label>Lieu</label>
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
          />
          {erreurs.lieu && <span className={styles.erreurTxt}>{erreurs.lieu}</span>}
        </div>

        <div className={styles.champ}>
          <label>Prix (FCFA)</label>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
          />
          {erreurs.prix && <span className={styles.erreurTxt}>{erreurs.prix}</span>}
        </div>

        {/* Affichage de l'erreur serveur si l'écriture échoue */}
        {erreurServeur && (
          <p className={styles.erreur}>Erreur : {erreurServeur}</p>
        )}

        {/* Bouton désactivé pendant le traitement réseau */}
        <button type="submit" disabled={enCours} className={styles.bouton}>
          {enCours ? "Envoi..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default NouvelEvenement;