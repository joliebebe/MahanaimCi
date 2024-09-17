import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const modalDetails = () => {
    const route = useRoute();
    const { id } = route.params;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [commentAdded, setCommentAdded] = useState('');


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

    const handleValidation = () => {
        // Valider le formulaire
        // Vous pouvez ajouter ici la logique pour valider les informations du formulaire
        if (!comment.trim()) {
            alert('Veuillez saisir un commentaire.');
            return;
        }

        if (rating === 0) {
            alert('Veuillez sélectionner une note.');
            return;
        }

        // Example logic to save rating and comment
        console.log('Commentaire:', comment);
        console.log('Note:', rating);

        // You can call an API here to save the rating and comment

        setCommentAdded(comment); // Enregistre le commentaire ajouté
        setComment(''); // Réinitialise le champ de commentaire
        setRating(0); // Réinitialise la note

        // Après validation, naviguer vers l'écran HomeScreen
        // navigation.navigate('HomeScreen');
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons
                        name={rating >= i ? 'star' : 'star-outline'}
                        size={24}
                        color={rating >= i ? '#FFD700' : '#ccc'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
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
                    {/* Formulaire de commentaire */}
                    <View style={styles.commentContainer}>
                    <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>Votre note :</Text>
                            {renderStars()}
                        </View>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Ajouter un commentaire..."
                            value={comment}
                            onChangeText={text => setComment(text)}
                        />
                        
                        <TouchableOpacity style={styles.submitButton} onPress={handleValidation}>
                            <Text style={styles.submitButtonText}>Envoyer</Text>
                        </TouchableOpacity>
                        {/* Afficher le commentaire ajouté */}
    {commentAdded ? (
        <View style={styles.commentAddedContainer}>
            <Text style={styles.commentAddedText}>Commentaire reçu :</Text>
            <Text>{commentAdded}</Text>
        </View>
    ) : null}
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
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
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
    commentContainer: {
        marginTop: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#8b8745',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontFamily: 'TimesNewRomanBold',
        fontSize: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    ratingText: {
        marginRight: 10,
        fontSize: 16,
    },
    commentAddedContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
    },
    commentAddedText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    
});
