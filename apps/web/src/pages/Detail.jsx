import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Importation du client Supabase pour le DELETE
import BoutonInscription from "../components/BoutonInscription";
import styles from "./Detail.module.css";

const Detail = ({ evenements, session }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const evenement = evenements.find(ev => ev.id === Number(id));

  if (!evenement) {
    return (
      <div className={styles.container}>
        <p>Événement introuvable.</p>
        <Link to="/" className={styles.retour}>Retour à la liste</Link>
      </div>
    );
  }

  // Fonction pour supprimer l'événement (DELETE)
  const supprimer = async () => {
    const confirme = window.confirm("Supprimer cet événement ?");
    if (!confirme) return;

    const { error } = await supabase
      .from("evenements")
      .delete()
      .eq("id", evenement.id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      navigate("/");
    }
  };

  const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;
  const date = new Date(evenement.date_debut).toLocaleString("fr-FR");

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.retour}>
        &lt;- Retour
      </button>
      <h1 className={styles.titre}>{evenement.titre}</h1>
      <p className={styles.meta}>
        <span className={styles.categorie}>{evenement.categorie}</span>
      </p>
      <img
        src={evenement.image_url}
        alt={evenement.titre}
        className={styles.image}
      />
      <dl className={styles.infos}>
        <dt>Lieu</dt>
        <dd>{evenement.lieu_nom}</dd>
        <dt>Date</dt>
        <dd>{date}</dd>
        <dt>Prix</dt>
        <dd className={styles.prix}>{prix}</dd>
      </dl>

      {/* Bouton d'inscription/désinscription */}
      <BoutonInscription evenementId={evenement.id} session={session} />

      {/* Étape 4 : Bouton de suppression visible uniquement pour l'organisateur */}
      {session && session.user.id === evenement.organisateur_id && (
        <button onClick={supprimer} className={styles.supprimer}>
          Supprimer cet événement
        </button>
      )}
    </div>
  );
};

export default Detail;