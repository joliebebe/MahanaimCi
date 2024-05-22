import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Colors from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const Page = () => {
  const { cart, removeItemFromCart } = useCart();
  const navigation = useNavigation();

  const handleValidation = () => {
    navigation.navigate('notification');
  };

  const EmptyCartGif = require('@/assets/gif/EmptyCartGif.jpg');

  // Calcul du sous-total et du total des frais de livraison
  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 1300;
  const total = subTotal + deliveryFee;
  
  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    item.quantity = newQuantity;
    removeItemFromCart(item.quantity);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      item.quantity = newQuantity;
      removeItemFromCart(item.quantity);

    }
  };

  return (
    <>
    <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                }}
            />
    <View style={styles.container}>
      {cart.length === 0 ? (
        <Image source={EmptyCartGif} style={styles.emptyCartGif} />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image} />
                <View style={styles.itemContainer}>
                  <Text style={styles.title}>{item.categories}</Text>
                  <Text style={styles.subtitle}>{item.name}</Text>
                  <Text style={styles.amount}>{item.price} fcfa/Kg </Text>
                </View> 
                <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => handleDecrement(item)}>
                    <MaterialIcons name="remove" size={12} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleIncrement(item)}>
                    <MaterialIcons name="add" size={12} color="#fff" />
                  </TouchableOpacity>
          </View>
              </View>

            )}
          />
          <View style={styles.position}>
            <View style={styles.card1}>
            <View style={styles.inputContainer}>
              <Text style={styles.title1} >Localisation</Text>
              <TextInput style={styles.input} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.title1} >Mode de paiement / Livraison</Text>
              <TextInput style={styles.input} />
            </View>
              <View style={styles.inputContainer1}>
                <Text style={styles.guideText1}>Sous-total</Text>
                <Text style={styles.guideText1}>{subTotal} fcfa</Text>
              </View>
              <View style={styles.inputContainer2}>
                <Text style={styles.guideText1}>Frais de livraison</Text>
                <Text style={styles.guideText1}>{deliveryFee} fcfa</Text>
              </View>
              <View style={styles.inputContainer2}>
                <Text style={styles.guideText1}>Total</Text>
                <Text style={styles.guideText1}>{total} fcfa</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
              <Text style={styles.validationButtonText}>Valider la commande {total} fcfa</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    </>

  );
}
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  itemContainer:{

  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card1: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    color: Colors.bgColorsgreen,
    fontFamily: 'TimesNewRomanBold',
  },
  title1: {
    fontSize: 12,
    marginBottom: 5,
    color: Colors.bgColorsgreen,
    fontFamily: 'TimesNewRomanBold',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'TimesNewRomanBold',
  },
  amount: {
    fontFamily: 'TimesNewRomanBold',
    fontSize: 16,
    color: '#63f345',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: "#8b8745",
    borderRadius: 5,
    marginHorizontal: 5,
   // margin: 5,
  },
  quantity: {
    fontSize: 10,
    fontFamily: 'TimesNewRoman',
    paddingHorizontal: 6,
    backgroundColor: "#fff",
    padding: 6,
    marginHorizontal: 6
  },
  quantityContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },

  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 15,
    width: '100%',
    paddingVertical: 5,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderColor: 'lightgrey',
    marginHorizontal: 5,
  },
  inputContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 20,
    marginVertical: 20,
  },
  inputContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 20,
  },
  guideText1: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'TimesNewRoman',
    margin: 6,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  position: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  validationButton: {
    backgroundColor: '#8b8745',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  validationButtonText: {
    color: '#fff',
    fontFamily: 'TimesNewRoman',
    fontSize: 16,
    alignSelf: 'center',
  },
  emptyCartGif: {
    alignSelf: 'center',
    width: '90%',
    maxHeight: 300,
    aspectRatio: 1,
    marginVertical: 100,
    resizeMode: 'cover',
  },
});
