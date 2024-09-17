import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/CartContext';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Card, RadioButton } from 'react-native-paper';
import { UserContext } from '@/context/UserContext';
import CartIcon from '@/assets/images/CartIcon'; // Assurez-vous que le chemin est correct
import { Stack } from 'expo-router';

const Shopping = () => {
  const { user,token } = useContext(UserContext);
  const navigation = useNavigation();
  const { cart, addItemToCart, addOrderToHistory, removeItemFromCart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentOption, setPaymentOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const OrangeMoneyLogo = require('@/assets/images/orange_money.png');
  const MoovMoneyLogo = require('@/assets/images/moov_money.jpeg');
  const WaveMoneyLogo = require('@/assets/images/wave_money.png');
  const MtnMoneyLogo = require('@/assets/images/MTN-BON.jpg');

  useEffect(() => {
    const initializeData = async () => {
      if (!user) {
        setModalVisible(true);
      }
      const fee = await fetchDeliveryFee();
      setDeliveryFee(fee);
      await fetchPaymentMethods(); // Ajouter cet appel pour récupérer les méthodes de paiement
    };

    initializeData();
  }, [user]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`https://api.mahanaiim.ci/api/configuration/modes-de-paiement`);
      if (!response.ok) {
        throw new Error('Error fetching payment methods');
      }
      const data = await response.json();
      setPaymentMethod(data.resultat); // Mettre à jour l'état avec les méthodes de paiement récupérées
    } catch (error) {
      console.error('Error fetching payment methods: ', error);
      Alert.alert('Error', 'An error occurred while fetching payment methods.');
    }
  };


  const fetchDeliveryFee = async () => {
    try {
      const response = await fetch('https://api.mahanaiim.ci/api/configuration/frais-livraison-commande');
      if (!response.ok) {
        throw new Error('Error fetching delivery fee');
      }
      const data = await response.json();
      return parseInt(data.resultat.valeur, 10); // Convertir en entier
    } catch (error) {
      console.error('Error fetching delivery fee: ', error);
      Alert.alert('Error', 'An error occurred while fetching the delivery fee.');
      return 0; // Return 0 if there's an error to avoid breaking the calculations
    }
  };

  const handleValidation = async () => {
    if (!paymentOption) {
      Alert.alert('Erreur', 'Veuillez choisir un mode de paiement.');
      return;
    }
  
    const panierClient = cart.map(item => ({
      produit_id: item.id,
      quantite: item.quantity,
      prix_unitaire: item.prix,
      cout_total: item.prix * item.quantity,
    }));
  
    const orderData = {
      mode_paiement_id: parseInt(paymentOption, 10),
      montant_commande: totals.total,
      panier_client: panierClient,
      client_id: user.id, // Include the client_id here
    };
  
    try {
      if (!token) {
        throw new Error('Token is missing');
      }
  
      const response = await fetch('https://api.mahanaiim.ci/api/commandes/enregistrer-une-commande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
  
        if (data.statut === 'succes') {
          Alert.alert('Succès', 'Commande enregistrée avec succès');
          clearCart();
          navigation.navigate('notification', { order: data.resultat });
        } else {
          throw new Error(data.message || 'Erreur lors de l\'enregistrement de la commande');
        }
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
    } catch (error) {
      console.error('Error submitting order: ', error);
      if (error.message === 'Token is missing' || response.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('login') }
        ]);
      } else {
        Alert.alert('Erreur', `Une erreur est survenue lors de l'enregistrement de la commande: ${error.message}`);
      }
    }
  };
  
  
  const handleRemoveFromCart = (itemId) => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment le retirer du panier ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Confirmer',
        onPress: () => {
          removeItemFromCart(itemId);
        },
      },
    ]);
  };

  const handleCleanFromCart = () => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment vider le panier ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Confirmer',
        onPress: () => {
          clearCart();
        },
      },
    ]);
  };

  const calculateTotals = (cartItems, deliveryFee) => {
    const subTotal = cartItems.reduce((acc, item) => acc + parseInt(item.prix, 10) * parseInt(item.quantity, 10), 0);
    const total = subTotal + deliveryFee;
    return { subTotal, deliveryFee, total };
  };

  const [totals, setTotals] = useState(calculateTotals(cart, deliveryFee));

  useEffect(() => {
    setTotals(calculateTotals(cart, deliveryFee));
  }, [cart, deliveryFee]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Panier",
          headerRight: () => (
            <TouchableOpacity onPress={() => handleCleanFromCart()} style={{ paddingRight: 50 }}>
              <FontAwesome name="trash" size={24} color="#8b8745" />
            </TouchableOpacity>
          )
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Veuillez vous connecter ou vous inscrire pour valider votre commande</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate('login');
                }}
              >
                <Text style={styles.textStyle}>Se Connecter</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate('register');
                }}
              >
                <Text style={styles.textStyle}>S'Inscrire</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <CartIcon size={100} color="gray" />
            <Text style={styles.emptyCartText}>Votre panier est vide</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('index')}
            >
              <Text style={styles.continueShoppingButtonText}>Continuer vos achats</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <View style={styles.cardContent}>
                  <Image
                    source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
                    style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.name}>{item.libelle}</Text>
                    <Text style={styles.subtitle}>{item.description}</Text>
                    <Text style={styles.quantity}>Quantité: <Text style={{ color: '#8b8745', fontWeight: 'bold' }}>{item.quantity}</Text></Text>
                    <Text style={styles.price}>{item.prix} FCFA</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                    <MaterialIcons name="cancel" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <Card>
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Sous-total</Text>
              <Text style={styles.priceText}>{totals.subTotal} FCFA</Text>
            </View>
            <View style={styles.separatorDashed} />
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Frais de livraison</Text>
              <Text style={styles.priceText}>{totals.deliveryFee} FCFA</Text>
            </View>
            <View style={styles.separatorDashed} />
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.priceText}>{totals.total} FCFA</Text>
            </View>
            <View style={styles.separatorDashed} />
          </View>
          <View>
            <View>
              <Text style={styles.title1}>Mode de paiement</Text>
              <View style={styles.radioGroup}>
                {paymentMethod.map(method => ( // Utiliser paymentMethod ici pour afficher les options de paiement
                  <TouchableOpacity key={method.id} onPress={() => setPaymentOption(method.id.toString())}>
                    <View style={[styles.radioButtonContainer]}>
                      <RadioButton
                        value={method.id.toString()}
                        status={paymentOption === method.id.toString() ? 'checked' : 'unchecked'}
                        onPress={() => setPaymentOption(method.id.toString())}
                        color="#6200ee"
                        uncheckedColor="#6200ee"
                      />
                      <Text style={styles.radioLabel}>{method.libelle}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {paymentOption === '2' && (
                <View style={styles.paymentOptionsContainer}>
                  <TouchableOpacity onPress={() => setPaymentMethod('1')}>
                    <Image source={OrangeMoneyLogo} style={styles.paymentLogo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPaymentMethod('2')}>
                    <Image source={MoovMoneyLogo} style={styles.paymentLogo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPaymentMethod('3')}>
                    <Image source={WaveMoneyLogo} style={styles.paymentLogo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPaymentMethod('4')}>
                    <Image source={MtnMoneyLogo} style={styles.paymentLogo} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Card>

        <TouchableOpacity style={styles.validateButton} onPress={handleValidation}>
          <Text style={styles.validateButtonText}>Valider la commande</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  totals: {
    padding: 10,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  separator: {
    height: 1,
    backgroundColor: '#bbb', // Utiliser une couleur plus foncée
    marginVertical: 5,
    borderRadius: 1,
  },
  separatorDashed: {
    height: 1,
    backgroundColor: 'transparent',
    borderBottomColor: '#bbb', // Utiliser une couleur plus foncée
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  title1: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b8745',
  },
  quantity: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  validateButton: {
    backgroundColor: '#BBB65D',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  validateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20,
  },
  continueShoppingButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0288D1',
    borderRadius: 8,
  },
  continueShoppingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  paymentOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6200ee',
  },
});

export default Shopping;
