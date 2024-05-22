import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router';
import modalData from '@/assets/data/modal.json';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const modalDetails = () => {
    const { id } = useLocalSearchParams();
    // Recherchez l'élément correspondant dans la source de données en fonction de l'ID
    const item = modalData.find(item => item.id === id);

    if (!item) {
        // Gérez le cas où aucun élément correspondant n'est trouvé
        return <Text>Aucun élément correspondant trouvé pour l'ID {id}</Text>;
    };
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
        <View style={styles.container} >
            <Image
                source={{ uri: item.image }}
                style={styles.headerImage}
            />
           
            <View style={styles.contentContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.placeText}>{item.place}</Text>
                    <Text style={styles.priceText}>{item.price}</Text>
                </View>
                <Text style={styles.titreText}>Description</Text>

                <Text style={styles.descriptionText}>
                    {item.description}
                </Text>
                {/* <Button title="Fermer" onPress={onClose} /> */}

                <View style={styles.position}>
                    <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
                        <Text style={styles.validationButtonText}>AVIS CLIENTS </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
                        <Text style={styles.validationButtonText}>SOLLICITER SUR WHATSAPP </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </>

    )
}

export default modalDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerImage: {
        //flex: 1,
        width: '100%',
        height: 300,
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
});