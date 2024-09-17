import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "@rneui/base";
import { UserContext } from "@/context/UserContext";
import Colors from "@/constants/Colors";

const PasswordRemove = () => {
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState(user.email);

    const resetPassword = async () => {
        /*   try {
              const response = await fetch('https://api.eyavoyage.com/api/auth/reinitialiser-mot-de-passe', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                  Alert.alert("Succès", data.message || "Réinitialisation du mot de passe réussie !");
                  navigation.navigate('login'); // Naviguer vers l'écran de connexion
              } else {
                  Alert.alert("Erreur", data.message || "Échec de la réinitialisation du mot de passe.");
              }
          } catch (error) {
              console.error('Erreur lors de la réinitialisation du mot de passe:', error);
              Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
          } */
    };

    const onPress = () => {
        console.log('Réinitialisation du mot de passe pour:', email);
/*         setUser({ ...user, email });
        resetPassword(); // Appel à la fonction de réinitialisation du mot de passe
 */    };

    return (
        <View style={styles.contain}>
            <View style={styles.contain1}>
                <View>
                    <Text style={styles.titre}>Entrez votre Email</Text>
                </View>
                <Input
                    containerStyle={{}}
                    disabledInputStyle={{ background: "#ddd" }}
                    inputContainerStyle={{}}
                    value={email}
                    onChangeText={setEmail}
                    inputStyle={{}}
                    labelStyle={{ color: '#F57F50' }}
                    labelProps={{}}
                    leftIcon={<MaterialCommunityIcons name="account-outline" size={20} />}
                    leftIconContainerStyle={{}}
                    placeholder="test@gmail.com"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.position}>
                <TouchableOpacity style={styles.validationButton} onPress={resetPassword}>
                    <Text style={styles.validationButtonText}>Valider</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PasswordRemove;

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
        paddingVertical: 20,
    },
    position: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    
});
