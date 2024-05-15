import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, TextInput } from 'react-native';
import { useCart } from '@/context/CartContext';
import { useLocalSearchParams } from 'expo-router'; // Utilisez useLocalSearchParams pour obtenir les paramètres
import Colors from '@/constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';
//import { CartItem } from '@/types/cardItemType';

const Page = () => {
  const { cart, updateItemQuantity, getTotalPrice, clearCart } = useCart();
const route = useRoute();
  const navigation = useNavigation();
  const [totalPrice, setTotalPrice] = useState(0);
// Assurez-vous que route.params est défini et qu'il contient les propriétés attendues
const { cart: routeCart, totalPrice: routeTotalPrice } = route.params || {};

// Utilisez les valeurs de route.params s'ils sont disponibles, sinon utilisez les valeurs par défaut
const cartData = routeCart || cart;
const totalPriceData = routeTotalPrice || getTotalPrice();

  React.useEffect(() => {
    setTotalPrice(getTotalPrice());
  }, [cart]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity);
  };

  const handleValidation = () => {
    clearCart();
    navigation.navigate('notification');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier</Text>
      <FlatList
        data={cartData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Article: {item.name}</Text>
            <Text>Prix unitaire: {item.price} fcfa</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity - 1)}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, item.quantity + 1)}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text>Prix total: {item.price * item.quantity} fcfa</Text>
          </View>
        )}
      />
      <Text>Frais de livraison: 1300 fcfa</Text>
      <Text>Montant total: {totalPrice + 1300} fcfa</Text>
      
      {/* Intégrez ici la partie du composant ListingDetails */}
      <View style={styles.position}>
        <View style={styles.card1}>
          <View style={styles.inputContainer}>
            <Text style={styles.title1}>Localisation</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.title1}>Mode de paiement / Livraison</Text>
            <TextInput style={styles.input} />
          </View>
          <View style={styles.inputContainer1}>
            <Text style={styles.guideText1}>Sous-total</Text>
            <Text style={styles.guideText1}>{totalPrice} fcfa</Text>
          </View>
          <View style={styles.inputContainer2}>
            <Text style={styles.guideText1}>Frais de livraison</Text>
            <Text style={styles.guideText1}>1300 fcfa</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
          <Text style={styles.validationButtonText}>Valider la commande {totalPrice + 1300} fcfa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title1: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.bgColorsgreen,
    fontFamily: 'TimesNewRoman',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    padding: 5,
  },
  position: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card1: {
    flexDirection: 'column',
    width: '90%',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 15,
    width: '100%',
    paddingVertical: 5,
  },
  inputContainer: {
    marginBottom: 10,
    borderRadius: 15,
  },
  inputContainer1: {
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 15,
  },
  inputContainer2: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 15,
  },
  guideText1: {
    fontSize: 15,
    fontFamily: 'TimesNewRoman',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  validationButton: {
    backgroundColor: Colors.bgColorsgreen,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  validationButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TimesNewRoman',
  },
});