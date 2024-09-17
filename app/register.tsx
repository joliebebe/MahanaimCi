import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View , ScrollView} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';

const Page = () => {
  const navigation = useNavigation();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    navigation.navigate('login');
  };

  const handleValidation = async () => {
    try {
      const response = await axios.post('https://api.mahanaiim.ci/api/client/enregistrer-compte-client', {
        nom,
        prenom,
        telephone,
        email,
        password,
      });
      if (response.data.statut === 'succes') {
        navigation.navigate('(tabs)');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Erreur d\'enregistrement');
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.buttonText}>Mahanaïm.CI</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.title}>Créez votre compte</Text>
        <Text style={styles.comment}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</Text>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="Nom"
                style={styles.input}
                value={nom}
                // onChangeText={setNom}
                onChangeText={(text) => setNom(text.toUpperCase())}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="Prenom"
                style={styles.input}
                value={prenom}
                // onChangeText={setPrenom}
                onChangeText={(text) => setPrenom(text.toUpperCase())}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="call" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="+225 0707070707"
                style={styles.input}
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="E-mail"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="Mot de passe"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.position}>
            <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
              <Text style={styles.validationButtonText}>S'INSCRIRE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.lienText}>Vous avez déjà un compte?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    </SafeAreaProvider>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgColorspage,
  },
  container1: {
    backgroundColor: Colors.bgColorsGreenlight,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 30,
    paddingVertical: 30,
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-end',
    textAlign: 'center',
    //justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontFamily: 'TimesNewRomanBold',
    paddingBottom: 10,
  },
  comment: {
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
  lienText: {
    margin: 10,
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
    alignSelf: 'center',
  },
  position: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
