import { useState, useEffect } from "react";
import { estInscrit, inscrire, desinscrire } from "@senevent/shared";
import styles from "./BoutonInscription.module.css";

const BoutonInscription = ({ evenementId, session }) => {
    const [inscrit, setInscrit] = useState(false);
    const [chargement, setChargement] = useState(true);

    // Vérifier si déjà inscrit au montage
    useEffect(() => {
        const verifier = async () => {
            if (!session) {
                setChargement(false);
                return;
            }
            try {
                const resultat = await estInscrit(evenementId, session.user.id);
                setInscrit(resultat);
            } catch (error) {
                console.error("Erreur lors de la vérification de l'inscription :", error);
            } finally {
                setChargement(false);
            }
        };

        verifier();
    }, [evenementId, session]);

    const sInscrire = async () => {
        try {
            await inscrire(evenementId, session.user.id);
            setInscrit(true);
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    const seDesinscrire = async () => {
        try {
            await desinscrire(evenementId, session.user.id);
            setInscrit(false);
        } catch (error) {
            console.error("Erreur lors de la désinscription :", error);
        }
    };

    if (!session) {
        return <p className={styles.info}>Connectez-vous pour vous inscrire.</p>;
    }

    if (chargement) {
        return <p className={styles.info}>...</p>;
    }

    return inscrit ? (
        <button onClick={seDesinscrire} className={styles.desinscrire}>
            Se désinscrire
        </button>
    ) : (
        <button onClick={sInscrire} className={styles.inscrire}>
            S'inscrire
        </button>
    );
};

export default BoutonInscription;