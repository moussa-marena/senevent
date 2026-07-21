import { NavLink } from "react-router-dom";
import { seDeconnecter } from "@senevent/shared";
import styles from "./NavBar.module.css";

const NavBar = ({ session }) => {
    const lienActif = ({ isActive }) =>
        isActive ? `${styles.lien} ${styles.lienActif}` : styles.lien;

    const handleDeconnexion = async () => {
        try {
            await seDeconnecter();
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>SenEvent</div>
            <div className={styles.liens}>
                <NavLink to="/" end className={lienActif}>
                    Accueil
                </NavLink>

                {/* Le lien de création d'événement n'apparaît que si l'utilisateur est connecté */}
                {session && (
                    <NavLink to="/nouveau" className={lienActif}>
                        Nouvel evenement
                    </NavLink>
                )}

                {/* Affichage conditionnel selon l'état de connexion */}
                {session ? (
                    <>
                        <span className={styles.email}>{session.user.email}</span>
                        <button onClick={handleDeconnexion} className={styles.deconnexion}>
                            Se deconnecter
                        </button>
                    </>
                ) : (
                    <NavLink to="/auth" className={lienActif}>
                        Se connecter
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default NavBar;