import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Stack } from 'expo-router';

const OrderDetails = ({ route }) => {
  const { order } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.itemTitle}>{item.libelle}</Text>
      <Text style={styles.itemQuantity}>Quantité: {item.quantity}</Text>
      <Text style={styles.itemPrice}>{item.prix} fcfa/Kg</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: `Commande N°: ${order.id}`,
        }}
      />
      <SafeAreaView style={styles.container}>
        <Text style={styles.date}>Date: {order.date}</Text>
        <FlatList
          data={order.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
        <Text style={styles.total}>Total: {order.total} fcfa</Text>
        <Text style={styles.deliveryFee}>Frais de livraison: {order.deliveryFee} fcfa</Text>
        <Text style={styles.paymentMethod}>Mode de paiement: {order.paymentMethod}</Text>
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
  date: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    marginTop: 10,
  },
  deliveryFee: {
    fontSize: 16,
    color: '#7f7f7f',
    marginTop: 5,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#7f7f7f',
    marginTop: 5,
  },
});

export default OrderDetails;
