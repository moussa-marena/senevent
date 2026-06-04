import styles from "./EvenementCarte.module.css";

const EvenementCarte = ({ ev, afficherDetails }) => {
    const prix = ev.prix === 0 ? "Gratuit" : `${ev.prix} FCFA`;

    return (
        <div className={styles.carte}>
            <h3 className={styles.titre}>{ev.titre}</h3>
            <p className={styles.texte}>Catégorie: {ev.categorie}</p>

            {/* Rendu conditionnel */}
            {afficherDetails && (
                <p className={styles.texte}>Lieu: {ev.lieu_nom}</p>
            )}

            <p className={styles.prix}>{prix}</p>
        </div>
    );
};

export default EvenementCarte;