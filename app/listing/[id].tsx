import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import listingsData from '@/assets/data/details.json';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Listings from '@/components/Listings';
import CategoriesDetails from '@/assets/data/categoryDetails';
import { useCart } from '@/context/CartContext';
import { CartItemType } from '@/types/cardItemType';
import {ListingType} from '@/types/listingType';

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { addItemToCart, cart } = useCart(); // Utilisez le hook useCart pour accéder aux fonctions du panier
  const [item, setItem] = useState<CartItemType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(CategoriesDetails[0]);

  useEffect(() => {
    const foundItem = listingsData.find(item => item.id === id);
    if (foundItem) {
      setItem(foundItem);
      // Utiliser une valeur par défaut pour quantity si elle n'est pas définie
      setQuantity(foundItem.quantity || 1);
      setTotalPrice(foundItem.price * (foundItem.quantity || 1)); // Utiliser une valeur par défaut pour quantity si elle n'est pas définie
    } else {
      console.log('error');
    }
  }, [id]);
  // Fonction pour incrémenter la quantité
  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice(totalPrice + item.price); // Ajoutez le prix de l'élément au prix total
  };

  // Fonction pour décrémenter la quantité
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice(totalPrice - item.price); // Soustrayez le prix de l'élément du prix total
    }
  };

  // Fonction pour valider l'ajout au panier
// Fonction pour valider l'ajout au panier
const handleValidation = () => {
  if (item) {
    const itemWithQuantity: CartItemType = { ...item, quantity: quantity };
    addItemToCart(itemWithQuantity, quantity); // Ajoutez l'article au panier avec la quantité
    
    // Calculez le prix total à partir des données du panier
    const totalPrice = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    // Naviguer vers la page de shopping en transmettant les données correctes
    navigation.navigate('shopping', { cart: cart, totalPrice: totalPrice });
  }
};



  if (!item) {
    return <Text>Aucun élément correspondant trouvé pour l'ID {id}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: item.image }}
          style={styles.headerImage}
        />
        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.placeText}>{item.name}{'\n'}
              <Text style={styles.placeTextCategorie}>{item.categories}</Text>
            </Text>
            <Text style={styles.priceText}>{item.price} fcfa/kg</Text>
          </View>
          <Text style={styles.placeTextDestination}>{item.destination}, {item.destinationDetails}</Text>

          <View style={styles.quantityWrapper}>
            <Text style={styles.quantityText}>Quantité</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
                <MaterialIcons name="remove" size={15} color="#fff" />
              </TouchableOpacity>
              <View style={styles.quantityDisplayContainer}>
                <Text style={styles.quantityDisplay}>{quantity}</Text>
              </View>
              <TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
                <MaterialIcons name="add" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.description}>
            Description
          </Text>
          <Text style={styles.descriptionText}>
            {item.description}
          </Text>

          <TouchableOpacity style={styles.validationButton} onPress={handleValidation}>
            <Text style={styles.validationButtonText}>Ajouter au panier {totalPrice} fcfa</Text>
          </TouchableOpacity>
          <Text style={styles.autreProd}>
            AUTRE PRODUITS
          </Text>
          <Listings listings={listingsData} selectedCategory={selectedCategory} />


        </View>

      </ScrollView>
    </View>
  );
}

export default ListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 2,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 40,
    marginTop: -40,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  placeText: {
    fontSize: 18,
    fontFamily: 'TimesNewRomanBold',
  },
  autreProd: {
    fontSize: 18,
    fontFamily: 'TimesNewRomanBold',
    padding: 16,
    textAlign: 'center',
  },
  placeTextCategorie: {
    fontSize: 14,
    fontFamily: 'TimesNewRoman',
    color: Colors.bgColorsprice,
  },
  placeTextDestination: {
    fontSize: 18,
    fontFamily: 'TimesNewRomanBold',
    color: Colors.bgColorsprice,
  },
  priceText: {
    fontSize: 18,
    color: Colors.bgColorsprice,
    fontFamily: 'TimesNewRomanBold',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'TimesNewRoman',
    textAlign: 'justify',
    color: Colors.bgColorsgreen,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'TimesNewRoman',
    textAlign: 'justify',
  },
  position: {
    flexDirection: 'row',
  },
  validationButton: {
    backgroundColor: Colors.bgColorsgreen,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
  },
  validationButtonText: {
    color: Colors.white,
    fontFamily: 'TimesNewRomanBold',
    fontSize: 16,
    alignSelf: 'center',
  },
  quantityWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'TimesNewRoman',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgColorsgreen,
    borderRadius: 8,
  },
  counterButton: {
    padding: 10,
  },
  quantityDisplayContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  quantityDisplay: {
    fontSize: 12,
    fontFamily: 'TimesNewRoman',
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    padding: 10,
    marginHorizontal: 5,
  },
});
