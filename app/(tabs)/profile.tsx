import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';

const Page = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if (result?.canceled) {
        alert('You did not select any image.');
      } else if (result?.assets) {
        setSelectedImage(result.assets[0].uri);
      }
    };
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <MaterialIcons
              name="exit-to-app"
              size={24}
              color="#8b8745"
              style={{ marginRight: 15 }}
              onPress={() => {
                navigation.navigate('index');
              }}
            />
          ),
        });
      }, [navigation]);

  return (
    <SafeAreaProvider>
         <View style={styles.container} >
      <TouchableOpacity onPress={pickImageAsync}>
        <View style={styles.profilePictureContainer2}>
            <View style={styles.profilePictureContainer1}>
            <View style={styles.profilePictureContainer}>
            {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.profilePicture}  />
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

      <Text style={styles.name}>N'GUESS</Text>

     <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={24} color="#8b8745" />
        <Text style={styles.locationText}>New York, USA</Text>
      </View>
      <View style={styles.guideContainer}>
         <Text style={styles.guideText}>564</Text> 
         <Text style={styles.guideText1}>Transactions</Text>
     </View>

     <View style={styles.form}>
          <View style={styles.inputContainer}>
          <Text style={styles.guideText1}>Nom & Prénoms </Text>
           <Text style={styles.guideText1}>N'GUESS</Text>
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.guideText1}>Email</Text>
            <Text style={styles.guideText1}>**********@gmail.com</Text>
          </View>
          <View style={styles.inputContainer}>
          <Text style={styles.guideText1}>Téléphone</Text>
            <Text style={styles.guideText1}>0707070707</Text>
          </View>
        </View>
    </View>
    </SafeAreaProvider>
  );
};

export default Page;

const styles = StyleSheet.create({
 

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    //paddingTop:70,

  },
  profilePictureContainer1: {
    width: 140,
    height: 140,
    borderRadius: 70, // pour créer un cercle
    borderWidth:1,
    borderColor: '#63f345',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer2: {
    width: 120,
    height: 120,
    borderRadius: 60, // pour créer un cercle
    borderWidth:1,
    borderColor: '#63f345',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
   // paddingTop:20,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // pour créer un cercle
    borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Ajoutez cette ligne pour rendre le conteneur de l'image positionnable
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // pour créer un cercle
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'TimesNewRoman', // Utilisez votre propre police si nécessaire
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    fontFamily: 'TimesNewRoman', // Utilisez votre propre police si nécessaire
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
  locationContainer: {
    flexDirection: 'row',
   // alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontFamily: 'TimesNewRoman', // Utilisez votre propre police si nécessaire
    marginRight: 5,
    color:"#8b8745",
  },
  guideContainer: {
    backgroundColor: '#8b8745',
    padding:90,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    margin: 25,

},
guideText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'TimesNewRoman',
   margin:6,
   alignSelf:'center',
},
guideText1: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'TimesNewRoman',
   margin:6,
   alignSelf:'center',
   justifyContent: 'space-between', // Aligne les éléments sur les extrémités

},
form: {
    //marginBottom: 10,
    width:'100%',
    padding:10,
    justifyContent: 'space-between', // Aligne les éléments sur les extrémités

  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Aligne les éléments sur les extrémités
    alignItems: 'center',
    borderBottomWidth: 1, // Trait au bas
    borderColor: 'lightgrey',
    marginBottom: 20,
  },
  
  icon: {
    marginRight: 10,
  },
});
