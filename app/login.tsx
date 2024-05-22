import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
//import { useNavigation } from '@react-navigation/native';

const Page = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    // Naviguer vers l'écran d'inscription
    navigation.navigate('register');
  };

  const handleValidation = () => {
    // Naviguer vers l'écran d'accueil
    navigation.navigate('(tabs)');
  };
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.buttonText}>Mahanaïm.CI</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.title} >Connectez-vous</Text>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
            <TextInput placeholder="Nom & prenoms" style={styles.input} />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" style={styles.icon} />
            <TextInput placeholder="Mot de passe" secureTextEntry={true} style={styles.input} />
          </View>
        </View>

        <View style={styles.position}>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.lienText}>
              Créez un compte
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
            <Text style={styles.validationButtonText}>SE CONNECTER</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaProvider>
  );
}

export default Page

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
    //padding:20,
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
    // paddingBottom: 30,
    paddingVertical: 30,
  },
  position: {
    flex: 2,
    justifyContent: 'flex-end',
   // paddingVertical: 20,
    paddingBottom:50,
  },
  lienText: {
    marginBottom: 20,
    alignSelf: 'center',
    color: Colors.bgColorslink,
  },
})