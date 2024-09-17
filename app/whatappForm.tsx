import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Input } from "@rneui/base";
import axios from "axios";
import { UserContext } from "@/context/UserContext"; // Assurez-vous que le chemin est correct
import Colors from "@/constants/Colors";

const WhatsAppForm = () => {
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const route = useRoute();
    const { id } = route.params;
    const [descrip, setDescrip] = useState('');
    const [lieu, setLieu] = useState('');
    const [delais, setDelais] = useState('');
    const [bugdet, setBugdet] = useState('');

    const sendWhatsAppOrder = async () => {
        if (!user || !user.accessToken) {
            console.log("Utilisateur ou Token manquant:", user);
            Alert.alert(
                "Non authentifié",
                "Vous devez être connecté pour envoyer une commande.",
                [{ text: "OK", onPress: () => navigation.navigate('login') }]
            );
            return;
        }
    
        // Validation des champs
        if (!descrip.trim() || !lieu.trim() || !delais.trim() || !bugdet.trim()) {
            Alert.alert(
                "Champs manquants",
                "Tous les champs doivent être remplis.",
                [{ text: "OK" }]
            );
            return;
        }
    
        try {
            const response = await axios.post(
                'https://api.mahanaiim.ci/api/commandes/enregistrer-commande-prestation-whatsapp', 
                {
                    prestation_id: id, 
                    description: descrip,
                    lieu_livraison: lieu,
                    delai: delais,
                    prix: bugdet
                },
                {
                    headers: { Authorization: `Bearer ${user.accessToken}`, 'Content-Type': 'application/json' },
                }
            );
    
            console.log("WhatsApp API Response:", response.data);
    
            // Ouvrir l'URL de WhatsApp
            const url = response.data.resultat;
            Linking.openURL(url).catch((err) => {
                Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp. Assurez-vous qu\'il est installé.');
                console.error('Erreur lors de l\'ouverture de WhatsApp:', err);
            });
    
        } catch (error) {
            if (error.response) {
                Alert.alert(`Erreur: ${error.response.data.message}`);
            } else if (error.request) {
                Alert.alert('Problème réseau, veuillez réessayer.');
            } else {
                Alert.alert('Erreur de connexion');
            }
            console.error('Erreur lors de la connexion:', error);
        }
    };
    
    
    
    return (
        <ScrollView style={styles.contain}>
            <View>
                <View style={styles.contain1}>
                    <Text style={styles.titre}>Description du service</Text>
                    <Input
                        value={descrip}
                        onChangeText={setDescrip}
                        labelStyle={{ color: '#F57F50' }}
                        placeholder="J'ai besoin..."
                    />

                    <Text style={styles.titre}>Indication de la ville et du quartier</Text>
                    <Input
                        value={lieu}
                        onChangeText={setLieu}
                        labelStyle={{ color: '#F57F50' }}
                        placeholder="Abidjan, Treichville, Rue 42"
                    />

                    <Text style={styles.titre}>Délai souhaité</Text>
                    <Input
                        value={delais}
                        onChangeText={setDelais}
                        labelStyle={{ color: '#F57F50' }}
                        placeholder="Indiquez votre délai"
                    />

                    <Text style={styles.titre}>Budget</Text>
                    <Input
                        value={bugdet}
                        onChangeText={setBugdet}
                        labelStyle={{ color: '#F57F50' }}
                        placeholder="20000"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.position}>
                    <TouchableOpacity style={styles.validationButton} onPress={sendWhatsAppOrder}>
                        <Text style={styles.validationButtonText}>Valider</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default WhatsAppForm;

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
    },
    validationButton: {
        backgroundColor: Colors.bgColorsgreen,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 15,
    },
    validationButtonText: {
        color: Colors.white,
        fontFamily: 'TimesNewRoman',
        fontSize: 16,
        alignSelf: 'center',
    },
    contain1: {
        flex: 1,
        backgroundColor: "#fff",
    },
    titre: {
        fontSize: 20,
        color: '#0B4851',
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    position: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
