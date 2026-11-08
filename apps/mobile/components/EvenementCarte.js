import { Link } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

export default function EvenementCarte({ evenement }) {
    const prix = evenement.prix === 0 ? "Gratuit" : `${evenement.prix} FCFA`;

    return (
        <Link href={`/evenement/${evenement.id}`} asChild>
            <Pressable style={styles.carte}>
                {evenement.image_url && (
                    <Image source={{ uri: evenement.image_url }} style={styles.image} />
                )}
                <View style={styles.contenu}>
                    <Text style={styles.titre}>{evenement.titre}</Text>
                    <Text style={styles.lieu}>{evenement.lieu_nom}</Text>
                    <View style={styles.pied}>
                        <Text style={styles.categorie}>{evenement.categorie}</Text>
                        <Text style={styles.prix}>{prix}</Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    carte: {
        backgroundColor: "#fff",
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 10,
        overflow: "hidden",
        elevation: 2,
    },
    image: { width: "100%", height: 140 },
    contenu: { padding: 12 },
    titre: { fontSize: 16, fontWeight: "bold", color: "#1a3a5c" },
    lieu: { fontSize: 13, color: "#666", marginTop: 4 },
    pied: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    categorie: { fontSize: 12, color: "#ea7d2b", textTransform: "uppercase" },
    prix: { fontSize: 14, fontWeight: "bold", color: "#ea7d2b" },
});