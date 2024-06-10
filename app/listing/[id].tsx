import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import listingsData from '@/assets/data/details.json';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';
import Listings from '@/components/Listings';
import { useCart } from '@/context/CartContext';
import { CartItemType } from '@/types/cardItemType';
import Animated from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';

const ListingDetails = () => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { addItemToCart, removeItemFromCart, cart } = useCart();
  const [item, setItem] = useState<CartItemType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    const foundItem = listingsData.find((item) => item.id === id);
    if (foundItem) {
      setItem(foundItem);
      setQuantity(foundItem.quantity || 1);
      setTotalPrice(foundItem.price * (foundItem.quantity || 1));
      setSelectedCategory(foundItem.categories); // Mise à jour de la catégorie sélectionnée
    } else {
      console.log('error');
    }
  }, [id]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    setTotalPrice(totalPrice + (item?.price || 0));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice(totalPrice - (item?.price || 0));
    }
  };

  const handleAddToCart = () => {
    if (item) {
      const itemWithQuantity: CartItemType = { ...item, quantity };
      addItemToCart(itemWithQuantity, quantity);
      setIsCartEmpty(false);
    }
  };

  const handleRemoveFromCart = () => {
    if (item) {
      removeItemFromCart(item.id);
      setQuantity(1); // Réinitialiser la quantité
      setTotalPrice(0); // Réinitialiser le prix total
      setIsCartEmpty(true); // Mettre à jour l'état du panier
    }
  };

  const handleNavigation = () => {
    navigation.navigate('shopping'); // Passer le panier comme paramètre de navigation
    setIsCartEmpty(false);
  };

  console.log('item:', item);
  console.log('quantity:', quantity);
  console.log('totalPrice:', totalPrice);
  console.log('selectedCategory:', selectedCategory);
  console.log('isCartEmpty:', isCartEmpty);

  if (!item) {
    return <Text>Aucun élément correspondant trouvé pour l'ID {id}</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          // Existing header options
        }}
      />
      <View style={styles.container}>
        <Animated.ScrollView>
          <Image
            source={{ uri: item.image }}
            style={[styles.headerImage, { paddingTop: headerHeight }]}
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

            {isCartEmpty ? (
              <TouchableOpacity style={styles.validationButton} onPress={handleAddToCart}>
                <Text style={styles.validationButtonText}>Ajouter au panier {totalPrice} fcfa</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.validationButton} onPress={handleRemoveFromCart}>
                <Text style={styles.validationButtonText}>Retirer du panier {totalPrice} fcfa</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleNavigation}>
              <Text style={styles.lienPanier}>Aller à mon panier</Text>
            </TouchableOpacity>
            <Text style={styles.autreProd}>
              AUTRE PRODUITS
            </Text>
            <Listings listings={listingsData} selectedCategory={selectedCategory} />
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
};


export default ListingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 300,
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
  lienPanier: {
    paddingTop: 16,
    textAlign: 'center',
    fontFamily: 'TimesNewRoman',
    color: Colors.bgColorslink,
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
