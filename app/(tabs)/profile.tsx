import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useNavigation } from 'expo-router';
import { UserContext } from '@/context/UserContext';
import { ImageContext } from '@/context/ImageContext';

const Page = () => {
    const { selectedImage, setSelectedImage } = useContext(ImageContext);
    const [location, setLocation] = useState<string | null>(null);
    const { user } = useContext(UserContext); // Utiliser les informations utilisateur
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                setLocation(reverseGeocode[0].city || reverseGeocode[0].region || "Unknown");
            } else {
                setLocation("Unknown");
            }
        })();
    }, []);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (result.cancelled) {
            alert('You did not select any image.');
        } else if (result.assets) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleEditProfile = () => {
        // Vérifier si l'utilisateur est connecté
        if (!user) {
            navigation.navigate('login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
            return;
        }

        // Naviguer vers la page de modification du profil
        navigation.navigate('EditProfile');
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: false,
                    headerTitle: "Profil",
                    headerRight: () => (
                        <MaterialIcons
                            name="exit-to-app"
                            size={24}
                            color="#8b8745"
                            style={{ marginRight: 15 }}
                            onPress={() => {
                                navigation.navigate('login');
                            }}
                        />
                    ),
                }}
            />
            <SafeAreaProvider>
                <View style={styles.container}>
                    <TouchableOpacity onPress={pickImageAsync}>
                        <View style={styles.profilePictureContainer2}>
                            <View style={styles.profilePictureContainer1}>
                                <View style={styles.profilePictureContainer}>
                                    {selectedImage ? (
                                        <Image source={{ uri: selectedImage }} style={styles.profilePicture} />
                                    ) : (
                                        <View style={styles.profilePicture}>
                                            <MaterialIcons
                                                name="edit"
                                                size={24}
                                                color="#fff"
                                                style={[styles.editIconContainer, { backgroundColor: '#8b8745', borderRadius: 15 }]}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.name}>{user && user.nom ? user.nom : "Mon Compte"}</Text>

                    <View style={styles.locationContainer}>
                        <MaterialIcons name="location-on" size={24} color="#8b8745" />
                        <Text style={styles.locationText}>
                            {location || "Locating..."}
                        </Text>
                    </View>

                    <View style={styles.guideContainer}>
                        <TouchableOpacity onPress={handleEditProfile}>
                            <Text style={styles.editButtonText}>Mahanaiim{'\n'}Modifier</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        {/* Contenu principal */}
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.guideText1}>Nom</Text>
                            <Text style={styles.guideText1}>{user && user.nom ? user.nom : ""}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.guideText1}>Prénoms</Text>
                            <Text style={styles.guideText1}>{user && user.prenom ? user.prenom : ""}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.guideText1}>Email</Text>
                            <Text style={styles.guideText1}>{user && user.email ? user.email : ""}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.guideText1}>Téléphone</Text>
                            <Text style={styles.guideText1}>{user && user.telephone ? user.telephone : ""}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaProvider>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingTop: 20,
        justifyContent: 'flex-start', 
    },
    profilePictureContainer1: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: '#63f345',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePictureContainer2: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: '#63f345',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePictureContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontFamily: 'TimesNewRoman',
        marginBottom: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
       fontSize: 16,
        fontFamily: 'TimesNewRoman',
        marginRight: 5,
        color: "#8b8745",
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8b8745',
        padding: 4,
        borderRadius: 15,
        overflow: 'hidden', // Pour s'assurer que l'icône est correctement masquée par le bord arrondi
    },
    guideContainer: {
        backgroundColor: '#8b8745',
        paddingHorizontal: 90,
        paddingVertical: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgrey',
        margin: 25,
        alignSelf: 'center',

    },
    guideText: {
        color: '#000',
       fontSize: 16,
        fontFamily: 'TimesNewRoman',
        marginTop: 6,
        alignSelf: 'center',
        alignItems:'center'
    },
    guideText1: {
        color: '#000000',
       fontSize: 16,
        fontFamily: 'TimesNewRoman',
        margin: 6,
        alignSelf: 'center',
    },
    form: {
        width: '100%',
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'column', 
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#8b8745',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    editButtonText: {
        color: '#fff',
       fontSize: 18,
        fontFamily: 'TimesNewRoman',
        alignSelf: 'center',
        textAlign:'center'
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
