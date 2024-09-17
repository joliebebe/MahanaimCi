import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, ToastAndroid, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/CartContext';
import { CartItemType } from '@/types/cardItemType';
import Animated from 'react-native-reanimated';
import { useHeaderHeight } from '@react-navigation/elements';
import axios from 'axios';
import Listings from '@/components/Listings';
import Colors from '@/constants/Colors';
import ToastAjoute from '@/components/toastjoute';
import ToastRetirer from '@/components/toastRetirer';

const ListingDetails = () => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { addItemToCart, removeItemFromCart } = useCart();
  const [item, setItem] = useState<CartItemType | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showRemoveToast, setShowRemoveToast] = useState(false);
  const [otherProduit, setOtherProduit] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
        const categories = response.data.resultat.categories;
        let foundItem = null;
  
        categories.forEach((category) => {
          if (category.produits) {
            category.produits.forEach((product) => {
              if (product.id === parseInt(id)) {
                foundItem = product;
                setSelectedCategory(category.libelle);
              }
            });
          }
        });
  
        if (foundItem) {
          setItem(foundItem);
          setQuantity(1);
          setTotalPrice(foundItem.prix);
          setIsButtonDisabled(foundItem.prix === 0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchDetails();
      fetchOtherProduit();
    }
  }, [id]);
  

  const fetchOtherProduit = async () => {
    try {
      const response = await axios.get('https://api.mahanaiim.ci/api/produits/liste?etat=1');
      console.log(response.data.resultat); // Ajoutez ceci pour vérifier la structure des données
      setOtherProduit(response.data.resultat);
    } catch (error) {
      console.error("Error fetching other prestations:", error);
    }
  };

  const renderItems = ({ item }) => {
    if (!item || !item.image) {
      return null; // ou afficher un indicateur de chargement ou un message d'erreur
    }

    return (
      <Link href={`/modal/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.item}>
            <Image
              source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
              style={styles.image}
            />
            <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
            <Text style={styles.itemPrice}>{item.prix}</Text>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };


  const handleIncrement = () => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + 1;
      const newTotalPrice = (item?.prix || 0) * newQuantity;
      setTotalPrice(newTotalPrice);
      setIsButtonDisabled(newTotalPrice === 0);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity > 0) {
        const newQuantity = prevQuantity - 1;
        const newTotalPrice = (item?.prix || 0) * newQuantity;
        setTotalPrice(newTotalPrice);
        setIsButtonDisabled(newTotalPrice === 0);
        return newQuantity;
      }
      return prevQuantity;
    });
  };

  const handleAddToCart = () => {
    if (item) {
      const itemWithQuantity: CartItemType = { ...item, quantity };
      addItemToCart(itemWithQuantity, quantity);
      setIsCartEmpty(false);
      //ToastAndroid.show('Ajouté au panier: ' + item.libelle, ToastAndroid.SHORT);
      setShowAddToast(true);
      setTimeout(() => {
        setShowAddToast(false);
      }, 3000); // Afficher le toast d'ajout pendant 3 secondes
    }
  };

  const handleRemoveFromCart = () => {
    if (item) {
      removeItemFromCart(item.id);
      setQuantity(1);
      setTotalPrice(0);
      setIsCartEmpty(true);
      setIsButtonDisabled(true);
      // ToastAndroid.show('Retiré du panier: ' + item.libelle, ToastAndroid.SHORT);
      setShowRemoveToast(true);
      setTimeout(() => {
        setShowRemoveToast(false);
      }, 3000); // Afficher le toast de retrait pendant 3 secondes
    }
  };

  const handleNavigation = () => {
    navigation.navigate('shopping');
    setIsCartEmpty(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: "rgba(225, 225, 225, 0.5)", borderRadius: 10, padding: 4 }} >
              <View style={{ backgroundColor: Colors.white, padding: 6, borderRadius: 10 }} >
                <Feather name='arrow-left' size={20} />
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <ScrollView style={styles.container}>

        <Animated.ScrollView>
          <Image
            source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
            style={[styles.headerImage, { paddingTop: headerHeight }]}
          />

          <View style={styles.toastContainer}>
            {showAddToast && <ToastAjoute />}
            {showRemoveToast && <ToastRetirer />}
          </View>

          <View style={styles.contentContainer}>

            <View style={styles.infoContainer}>
              <Text style={styles.placeText}>{item.libelle}{'\n'}
                <Text style={styles.placeTextCategorie}>{selectedCategory}</Text>
              </Text>
              <Text style={styles.priceText}>{item.prix} fcfa</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingBottom: 10, alignSelf: 'center' }}>
              <Ionicons name="location" size={24} color="#63f345" style={{ paddingRight: 10 }} />
              <Text style={styles.state}>{item.localisation_produit}</Text>
            </View>

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
              <TouchableOpacity
                style={[styles.validationButton, isButtonDisabled && styles.disabledButton]}
                onPress={handleAddToCart}
                disabled={isButtonDisabled}
              >
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
              AUTRE MENUS
            </Text>
           
            <Listings selectedCategory={{ id: parseInt(id), libelle: selectedCategory }} />
          </View>
        </Animated.ScrollView>
      </ScrollView>


    </>
  );
};

export default ListingDetails;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: '#fff',
  },
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    width: 170,
    borderColor: '#ccc',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,

  },

  itemTxt: {
    fontSize: 16,
    fontFamily: 'TimesNewRomanBold',
    fontWeight: 'bold',
    // marginVertical:15
  },
  itemDescript: {
    fontFamily: 'TimesNewRomanBold',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemPrice: {
    fontFamily: 'TimesNewRoman',
    color: '#63f446',
    fontSize: 16,
    marginVertical: 5,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  state: {
    fontSize: 24,
    fontFamily: 'TimesNewRomanBold',
    color: Colors.bgColorsprice,
    textAlign: 'center',
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
