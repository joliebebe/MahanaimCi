import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Stack, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '@/context/UserContext';

const ModalDetails = () => {
    const { user, token } = useContext(UserContext);
    const route = useRoute();
    const { id } = route.params;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
            const prestations = response.data.resultat.prestations_pro;
            const prestation = prestations.find(prestation => String(prestation.id) === String(id));
            if (prestation) {
                setItem(prestation);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching prestation details:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                            <Feather name='arrow-left' size={20} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView contentContainerStyle={styles.container}>
                {item?.image ? (
                    <Image
                        source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
                        style={styles.headerImage}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text>Aucune image disponible</Text>
                    </View>
                )}
                <View style={styles.contentContainer}>
                    <Text style={styles.libelleText}>{item.libelle}</Text>
                    <Text style={styles.titreText}>Description</Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                    <Text style={styles.titreText}>Prix</Text>
                    <Text style={styles.priceText}>{item.prix} FCFA</Text>
                    {/* Vous pouvez ajouter plus de détails ici */}
                </View>
            </ScrollView>
        </>
    );
};

export default ModalDetails;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    headerButton: {
        padding: 10,
    },
    headerImage: {
        width: '100%',
        height: 250,
    },
    placeholderImage: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    contentContainer: {
        paddingVertical: 20,
    },
    libelleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    titreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#444',
        marginBottom: 20,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#63f446',
        marginBottom: 10,
    },
});
