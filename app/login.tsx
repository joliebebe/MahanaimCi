import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { UserContext } from '@/context/UserContext';

const Page = () => {
    const navigation = useNavigation();
    const { setUser } = useContext(UserContext);
    const [login_user, setLogin_user] = useState('');
    const [password_user, setPassword_user] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleRegister = () => {
        navigation.navigate('register');
    };

    const handleValidation = async () => {
        try {
            console.log('Tentative de connexion avec:', { login_user, password_user });
            const response = await axios.post('https://api.mahanaiim.ci/api/auth/login-client', {
                login_user,
                password_user,
            });
            console.log('Réponse de l\'API:', response.data);
            if (response.data.status === 'success') {
                setUser(response.data.result); // Stocker les informations utilisateur dans le contexte
                navigation.navigate('(tabs)');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur de connexion');
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.container1}>
                <Text style={styles.buttonText}>Mahanaïm.CI</Text>
            </View>
            <View style={styles.container2}>
                <Text style={styles.title}>Connectez-vous</Text>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="call" size={24} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Numero de téléphone"
                            style={styles.input}
                            value={login_user}
                            onChangeText={setLogin_user}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Mot de passe"
                            secureTextEntry={!passwordVisible}
                            style={styles.input}
                            value={password_user}
                            onChangeText={setPassword_user}
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                            <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.position}>
                    <TouchableOpacity onPress={handleRegister}>
                        <Text style={styles.lienText}>Créez un compte</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
                        <Text style={styles.validationButtonText}>SE CONNECTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaProvider>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColorsGreenlight,
    },
    container1: {
        backgroundColor: Colors.bgColorsGreenlight,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginVertical: 30,
        paddingVertical: 50,
    },
    buttonText: {
        fontFamily: 'TimesNewRomanBold',
        fontSize: 32,
        textAlign: 'center',
        padding: 8,
    },
    container2: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderWidth: 1,
        borderColor: Colors.bgColorsgraylight,
        paddingHorizontal: 35,
    },
    form: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.bgColorsgray,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        borderColor: Colors.bgColorsgray,
        borderRadius: 10,
        padding: 10,
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
    title: {
        fontSize: 24,
        fontFamily: 'TimesNewRomanBold',
        paddingVertical: 30,
    },
    position: {
        flex: 2,
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    lienText: {
        marginBottom: 20,
        alignSelf: 'center',
        color: Colors.bgColorslink,
    },
});
