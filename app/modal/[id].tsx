import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const modalDetails = () => {
    const route = useRoute();
    const { id } = route.params;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Component mounted with ID:", id);
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        console.log("Fetching details for ID:", id);
        try {
            const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
            console.log("API Response:", response.data);

            const prestations = response.data.resultat.prestations_pro;
            console.log("Prestations Pro:", prestations);

            // Ensure ID type consistency
            const prestation = prestations.find(prestation => String(prestation.id) === String(id));
            if (prestation) {
                setItem(prestation);
            } else {
                console.error("Prestation not found");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching prestation pro details:", error);
            console.error("Error details:", error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!item) {
        return (
            <View style={styles.errorContainer}>
                <Text>Details not found!</Text>
            </View>
        );
    }
    const handleValidation = () => {
        // Valider le formulaire
        // Vous pouvez ajouter ici la logique pour valider les informations du formulaire

        // Après validation, naviguer vers l'écran HomeScreen
        // navigation.navigate('HomeScreen');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: "rgba(225, 225, 225, 0.5)", borderRadius: 10, padding: 4 }} >
                            <View style={{ backgroundColor: Colors.white, padding: 6, borderRadius: 10 }} >
                                <Feather name='arrow-left' size={20} />
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
            <ScrollView contentContainerStyle={styles.container}>
                {item.image ? (
                    <Image
                    source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
                    style={styles.headerImage}
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text>No Image Available</Text>
                    </View>
                )}
                <View style={styles.contentContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.placeText}>{item.libelle}</Text>
                        <Text style={styles.priceText}>{item.prix} FCFA</Text>

                    </View>
                    <Text style={styles.titreText}>Description</Text>
                    <Text style={styles.descriptionText}>{item.description}</Text>
                    <View style={styles.position}>
                        <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
                            <Text style={styles.validationButtonText}>AVIS CLIENTS </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
                            <Text style={styles.validationButtonText}>SOLLICITER SUR WHATSAPP </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

export default modalDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImage: {
        //flex: 1,
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
    },
    contentContainer: {
        flex: 2,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 40,
        marginTop: -40,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 20,
    },
    placeText: {
        fontSize: 18,
        fontFamily: 'TimesNewRoman',
    },
    priceText: {
        fontSize: 18,
        color: '#63f345',
        fontFamily: 'TimesNewRoman',

    },
    titreText: {
        fontSize: 20,
        marginBottom: 20,
        color: '#63f345',
        fontFamily: 'TimesNewRomanBold',

    },
    descriptionText: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'TimesNewRoman',
        textAlign: 'justify',
    },
    position: {
        flexDirection: 'row',
        // marginHorizontal:10,

    },
    validationButton: {
        backgroundColor: '#8b8745',
        paddingHorizontal: 13,
        paddingVertical: 15,
        borderRadius: 15,
        marginLeft: 10,

    },
    validationButtonText: {
        color: '#fff',
        fontFamily: 'TimesNewRomanBold',
        fontSize: 10,
        alignSelf: 'center',
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
