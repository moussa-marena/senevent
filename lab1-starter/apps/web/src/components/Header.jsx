import styles from "./Header.module.css";

const Header = ({ onCharger, chargement, nbResultats }) => {
    return (
        <header>
            <h1 className={styles.titre}>SenEvent --- Événements à Dakar</h1>

            <button
                onClick={onCharger}
                disabled={chargement}
                className={styles.bouton}
            >
                {chargement ? "Chargement ..." : "Charger les événements"}
            </button>

            {nbResultats > 0 && (
                <p className={styles.compteur}>
                    {nbResultats} événement(s) trouvé(s)
                </p>
            )}
        </header>
    );
};

export default Header;