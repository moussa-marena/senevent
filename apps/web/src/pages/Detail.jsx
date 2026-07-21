import { useParams, useNavigate, Link } from "react-router-dom";
import { supprimerEvenement } from "@senevent/shared";
import BoutonInscription from "../components/BoutonInscription";
import styles from "./Detail.module.css";

const Detail = ({ evenements, session }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const evenement = evenements.find((ev) => ev.id === Number(id));

  if (!evenement) {
    return (
      <div className={styles.container}>
        <p>Événement introuvable.</p>
        <Link to="/" className={styles.retour}>
          Retour à la liste
        </Link>
      </div>
    );
  }

  // Fonction pour supprimer l'événement via le package partagé
  const supprimer = async () => {
    const confirme = window.confirm("Supprimer cet événement ?");
    if (!confirme) return;

    try {
      await supprimerEvenement(evenement.id);
      navigate("/");
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;
  const date = new Date(evenement.date_debut).toLocaleString("fr-FR");

  // --- LOGIQUE D'AFFICHAGE DES IMAGES PAR DÉFAUT DU PROJET ---
  const nomCategorie = evenement.categorie
    ? evenement.categorie.toLowerCase()
    : "";

  const estUneUrlDistante =
    evenement.image_url && evenement.image_url.startsWith("http");

  const imageSource = estUneUrlDistante
    ? evenement.image_url
    : `/${nomCategorie}.png`;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.retour}>
        &lt;- Retour
      </button>
      <h1 className={styles.titre}>{evenement.titre}</h1>
      <p className={styles.meta}>
        <span className={styles.categorie}>{evenement.categorie}</span>
      </p>

      {/* Affichage de l'image basée sur la catégorie */}
      <img
        src={imageSource}
        alt={evenement.titre}
        className={styles.image}
        onError={(e) => {
          e.target.src = `/${nomCategorie}.jpg`;
        }}
      />

      <dl className={styles.infos}>
        <dt>Organisé par</dt>
        <dd>
          {evenement.profiles ? evenement.profiles.nom : "Équipe SenEvent"}
        </dd>

        <dt>Lieu</dt>
        <dd>{evenement.lieu_nom}</dd>

        <dt>Date</dt>
        <dd>{date}</dd>

        <dt>Prix</dt>
        <dd className={styles.prix}>{prix}</dd>
      </dl>

      {/* Bouton d'inscription/désinscription */}
      <BoutonInscription evenementId={evenement.id} session={session} />

      {/* Bouton de suppression visible uniquement pour l'organisateur */}
      {session && session.user.id === evenement.organisateur_id && (
        <button onClick={supprimer} className={styles.supprimer}>
          Supprimer cet événement
        </button>
      )}
    </div>
  );
};

export default Detail;