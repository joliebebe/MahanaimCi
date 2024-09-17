import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { UserContext } from '@/context/UserContext';

const EditProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const navigation = useNavigation();
    const [nom, setNom] = useState(user.nom || '');
    const [prenom, setPrenom] = useState(user.prenom || '');
    const [email, setEmail] = useState(user.email || '');
    const [telephone, setTelephone] = useState(user.telephone || '');

    const handleSaveChanges = () => {
        // Valider les champs si nécessaire
        if (!nom || !prenom || !email || !telephone) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        // Mettre à jour les informations utilisateur
        setUser({
            ...user,
            nom,
            prenom,
            email,
            telephone,
        });

        // Naviguer vers la page précédente
        navigation.goBack();
    };

    return (
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
});
