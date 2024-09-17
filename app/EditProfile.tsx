import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router, useNavigation } from 'expo-router';
import { UserContext } from '@/context/UserContext';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const EditProfile = () => {
    const { user, setUser, token } = useContext(UserContext);
    const navigation = useNavigation();
    const [nom, setNom] = useState(user.nom || '');
    const [prenom, setPrenom] = useState(user.prenom || '');
    const [email, setEmail] = useState(user.email || '');
    const [telephone, setTelephone] = useState(user.telephone || '');

    const handleSaveChanges = async () => {
        if (!nom || !prenom || !email || !telephone) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        const updatedUser = { ...user, nom, prenom, email, telephone };

        try {
            const response = await axios.post('https://api.mahanaiim.ci/api/client/modifier-information-client', updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.statut === 'succes') {
                setUser(updatedUser);
                Alert.alert('Succès', 'Profil mis à jour avec succès.');
                navigation.goBack();
            } else {
                Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du profil.');
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de la mise à jour du profil.');
        }
    };

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
            <View style={styles.container}>
                <Text style={styles.title}>Modifier le profil</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nom"
                    value={nom}
                    onChangeText={setNom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    value={prenom}
                    onChangeText={setPrenom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Téléphone"
                    value={telephone}
                    onChangeText={setTelephone}
                    keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'TimesNewRoman',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#8b8745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'TimesNewRoman',
    },
    headerButton: {
        backgroundColor: "rgba(225, 225, 225, 0.5)",
        borderRadius: 10,
        padding: 4,
    },
    headerIconContainer: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 10,
    },
});
