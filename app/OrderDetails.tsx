import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const OrderDetails = () => {
  const route = useRoute();

  useEffect(() => {
    console.log('Route:', route);
  }, [route]);

  if (!route || !route.params || !route.params.order) {
    console.log('Route ou order non défini:', route);
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des détails de la commande...</Text>
      </View>
    );
  }

  const { order } = route.params;

  useEffect(() => {
    console.log('Order Details:', order);
  }, [order]);

  const renderItem = ({ item }) => {
    console.log('Rendering Item:', item);
    const imageUrl = item.image.startsWith('http') ? item.image : `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}`;

    return (
      <Card style={styles.card}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>N°: {item.id}</Text>
          <Text style={styles.itemProduct}>{item.produit}</Text>
          <Text style={styles.itemPrice}>{item.prix_unitaire} fcfa/Kg</Text>
          <Text style={styles.itemQuantity}>Quantité: {item.quantite}</Text>
        </View>
      </View>
    </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: `Détails de la commande`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <View style={styles.headerIconContainer}>
                <Feather name='arrow-left' size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.date}>Date: {order.created_at}</Text>
        <FlatList
          data={order.details_panier}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
        <Card style={styles.totalsCard}>
          <View style={styles.totalsContainer}>
            <Text style={styles.total}>Total: {order.cout_total} fcfa</Text>
            <Text style={styles.deliveryFee}>Frais de livraison: {order.frais_livraison ? order.frais_livraison : 'Non spécifié'} fcfa</Text>
            <Text style={styles.paymentMethod}>Mode de paiement: {order.mode_paiement}</Text>
          </View>
        </Card>
      </SafeAreaView>
    </>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  headerButton: {
    padding: 4,
  },
  headerIconContainer: {
    padding: 6,
    borderRadius: 10,
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryColorblue,
  },
  itemProduct: {
    fontSize: 14,
    color: Colors.bgColorsgreen,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryColorblue,
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  totalsCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  totalsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryColorblue,
    marginBottom: 5,
  },
  deliveryFee: {
    fontSize: 16,
    color: Colors.bgColorsgreen,
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 16,
    color: Colors.primaryColorblue,
  },
});


export default OrderDetails;
