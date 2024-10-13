import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, FlatList, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Link, Stack, router, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '@/context/UserContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const modalDetails = () => {
    const { user, token } = useContext(UserContext);
    const route = useRoute();
    const { id } = route.params;
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [commentAdded, setCommentAdded] = useState('');
    const [whatsappAdded, setWhatsappAdded] = useState('');
    const [avisVisible, setAvisVisible] = useState(false); // État pour afficher/masquer les avis
    const [avisClients, setAvisClients] = useState([]); // État pour stocker les avis clients
    const navigation = useNavigation();
    const [otherPrestations, setOtherPrestations] = useState([]);

    useEffect(() => {
        console.log("Component mounted with ID:", id);
        fetchDetails();
        fetchOtherPrestations();
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
        }
    };
    const fetchOtherPrestations = async () => {
        try {
            const response = await axios.get('https://api.mahanaiim.ci/api/prestations/liste?etat=1');
            setOtherPrestations(response.data.resultat);
        } catch (error) {
            console.error("Error fetching other prestations:", error);
        }
    };

    const handleSolliciterWhats = () => {
        navigation.navigate('whatappForm', { id });
    };
    const renderItems = ({ item }) => (
        <Link href={`/modal/${item.id}`} asChild>
            <TouchableOpacity>
                <View style={styles.item}>
                    <Image
                        source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
                        style={styles.image}
                    />
                    <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
                    <Text style={styles.itemPrice}>{item.valeur}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
    const toggleAvisVisibility = async () => {
        if (!avisVisible) {
            try {
                const response = await axios.get(`https://api.mahanaiim.ci/api/avis-client/liste-commentaire-prestation?etat=1&prestation_id=${id}`);
                setAvisClients(response.data.resultat); // Stocke les avis reçus
            } catch (error) {
                console.error("Error fetching avis:", error);
            }
        }
        setAvisVisible(!avisVisible); // Bascule l'état d'affichage
    };

    const handleValidation = async () => {
        if (!comment.trim() || rating === 0) {
            alert('Veuillez saisir un commentaire et une note.');
            return;
        }
        if (!user || !user.accessToken) {
            console.log("Utilisateur ou Token manquant:", user);
            Alert.alert(
                "Non authentifié",
                "Vous devez être connecté pour envoyer un avis.",
                [{ text: "OK", onPress: () => navigation.navigate('login') }]
            );
            return;
        }
        try {
            await axios.post('https://api.mahanaiim.ci/api/avis-client/ajouter-commentaire-prestation',
                {
                    prestation_id: id,
                    commentaire: comment,
                    note: rating
                }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentAdded(comment);
            setComment('');
            setRating(0);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const renderAvisStars = (note) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={note >= i ? 'star' : 'star-outline'}
                    size={24}
                    color={note >= i ? '#FFD700' : '#ccc'}
                />
            );
        }
        return stars;
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

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <View style={styles.headerIconContainer}>
                                <Feather name='arrow-left' size={20} />
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
            <SafeAreaProvider>
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
                            <Text style={styles.placeText}>{item.valeur}</Text>
                        </View>
                        <Text style={styles.titreText}>Description</Text>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                        <View style={styles.position}>
                            <TouchableOpacity style={styles.validationButton} onPress={toggleAvisVisibility}>
                                <Text style={styles.validationButtonText}>
                                    {avisVisible ? 'CACHER AVIS CLIENTS' : 'AVIS CLIENTS'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.validationButton} onPress={handleSolliciterWhats}>
                                <Text style={styles.validationButtonText}>SOLLICITER SUR WHATSAPP</Text>
                            </TouchableOpacity>
                        </View>
                        {avisVisible && avisClients.length > 0 && (
                            <View style={styles.avisContainer}>
                                {avisClients.map((avis, index) => (
                                    <View key={index} style={styles.avis}>
                                        <Text style={styles.avisText}>{avis.commentaire}</Text>
                                        <View style={styles.ratingContainer}>
                                            {renderAvisStars(avis.note)}
                                        </View>
                                    </View>
                                ))}

                            </View>
                        )}
                        <View style={styles.commentContainer}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>Votre commentaire :</Text>
                                {renderStars()}
                            </View>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Ajouter un commentaire..."
                                value={comment}
                                onChangeText={text => setComment(text)}
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleValidation}>
                                <Text style={styles.submitButtonText}>Envoyer</Text>
                            </TouchableOpacity>
                            {commentAdded && (
                                <View style={styles.commentAddedContainer}>
                                    <Text style={styles.commentAddedText}>Commentaire envoyé avec succès :</Text>
                                    <Text>{commentAdded}</Text>
                                </View>
                            )}
                            <View>
                                <Text style={styles.autreProd}>
                                    AUTRES PRESTATIONS
                                </Text>
                                {loading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    <FlatList
                                        data={otherPrestations}
                                        keyExtractor={(item) => item.id.toString()}
                                        renderItem={renderItems}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaProvider>

        </>
    );
};
export default modalDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    headerButton: {
        backgroundColor: "rgba(225, 225, 225, 0.5)",
        borderRadius: 10,
        padding: 4,
    },
    item: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 10,
        width: 170,
        borderColor: '#ccc',
        shadowColor: '#ccc',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
        margin: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,

    },

    itemTxt: {
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
        fontWeight: 'bold',
        // marginVertical:15
    },
    itemDescript: {
        fontFamily: 'TimesNewRomanBold',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemPrice: {
        fontFamily: 'TimesNewRoman',
        color: '#63f446',
        fontSize: 12,
        marginVertical: 5,
    },
    headerIconContainer: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 10,
    },
    headerImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    contentContainer: {
        flex: 2,
        backgroundColor: '#fff',
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
        fontFamily: 'TimesNewRomanBold',
        //color: Colors.bgColorsprice,
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
        justifyContent: 'space-between',
    },
    validationButton: {
        backgroundColor: '#8b8745',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    validationButtonText: {
        color: '#fff',
        fontFamily: 'TimesNewRomanBold',
        fontSize: 14,
        textAlign: 'center',
    },
    avisContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
    },
    avis: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'

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
        height: 100,
        fontFamily: 'TimesNewRoman',
    },
    submitButton: {
        backgroundColor: '#8b8745',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 10,
    },
    avisText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
        paddingHorizontal: 20
    },
    ratingText: {
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
        marginRight: 10,
    },
    commentAddedContainer: {
        marginTop: 20,
    },
    commentAddedText: {
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
    },
    autreProd: {
        fontSize: 18,
        fontFamily: 'TimesNewRomanBold',
        padding: 16,
        textAlign: 'center',
    },
});
