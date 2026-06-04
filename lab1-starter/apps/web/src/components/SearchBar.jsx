import styles from "./SearchBar.module.css";

const SearchBar = ({ valeur, onChangement }) => {
    return (
        <div className={styles.conteneur}>
            <input
                type="text"
                placeholder="Rechercher un événement par titre..."
                value={valeur}
                onChange={(e) => onChangement(e.target.value)}
                className={styles.input}
            />
        </div>
    );
};

export default SearchBar;