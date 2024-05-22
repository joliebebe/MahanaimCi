import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, useNavigation } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const register = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    // Naviguer vers l'écran d'inscription
    navigation.navigate('login');
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
        <Text style={styles.title} >Créez votre compte</Text>
        <Text style={styles.comment}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor </Text>
        {/* Formulaire */}
        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
            <TextInput placeholder="Nom & prenoms" style={styles.input} />
          </View>
          {/* Email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
            <TextInput placeholder="E-mail" style={styles.input} />
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
            Vous avez déjà un compte?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
          <Text style={styles.validationButtonText}>SE CONNECTER</Text>
        </TouchableOpacity>
        </View>
       

    </View>
    </SafeAreaProvider>
  )
}

export default register

const styles = StyleSheet.create({
  container: {
      backgroundColor: Colors.bgColorspage,
      
    }, 
  container1: {
    backgroundColor: Colors.bgColorsGreenlight,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 30,
    paddingVertical: 50,
    
  },
  container2: {
      flex: 1,
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      borderTopLeftRadius: 50, 
      borderTopRightRadius: 50,
      borderWidth: 1,
      borderColor: Colors.bgColorsgraylight,
      paddingHorizontal: 35,
      paddingVertical: 30,
    },
    buttonText: {
      fontFamily: 'TimesNewRomanBold',
      fontSize: 32,
      textAlign: 'center',
      padding: 8,
    },
    title:{
      fontSize: 24,
      fontFamily: 'TimesNewRomanBold',
      paddingBottom: 10,

    },
    comment:{
      fontFamily: 'TimesNewRoman',
      paddingBottom: 25,

    },

    form: {
      marginBottom: 50,
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
      paddingVertical: 5, 
    },
    lienText:{
      marginBottom: 20,
      alignSelf: 'center',
      color: Colors.bgColorslink, 
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
      alignSelf:'center',
    },
    position:{
      flex: 2,
      justifyContent:'flex-end',
    }
});