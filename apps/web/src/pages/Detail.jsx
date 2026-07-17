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

  // --- LOGIQUE D'AFFICHAGE DES IMAGES PAR DÉFAUT DU PROJET ---
  // On récupère le nom de la catégorie pour charger le bon asset local / chemin relatif
  const nomCategorie = evenement.categorie ? evenement.categorie.toLowerCase() : "";

  // Si l'événement a une URL web valide (http...) venant de Supabase, on l'utilise.
  // Sinon, on reconstruit le chemin local dynamique vers ton dossier public (ex: /concert.png, /expo.png, /conference.png)
  const estUneUrlDistante = evenement.image_url && evenement.image_url.startsWith("http");

  const imageSource = estUneUrlDistante
    ? evenement.image_url
    : `/${nomCategorie}.png`; // S'adapte automatiquement à /concert.png, /expo.png, /conference.png etc.

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.retour}>
        &lt;- Retour
      </button>
      <h1 className={styles.titre}>{evenement.titre}</h1>
      <p className={styles.meta}>
        <span className={styles.categorie}>{evenement.categorie}</span>
      </p>

      {/* Affichage de ton image d'origine basée sur la catégorie */}
      <img
        src={imageSource}
        alt={evenement.titre}
        className={styles.image}
        onError={(e) => {
          // Sécurité au cas où l'extension est différente (ex: .jpg ou .svg au lieu de .png)
          e.target.src = `/${nomCategorie}.jpg`;
        }}
      />

      <dl className={styles.infos}>
        {/* Étape 5 : Affichage de l'organisateur via la jointure profiles */}
        <dt>Organisé par</dt>
        <dd>{evenement.profiles ? evenement.profiles.nom : "Équipe SenEvent"}</dd>

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