import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '@/context/UserContext'; // Adjust the import according to your UserContext location

const Notification = () => {
  const { user, token } = useUser();
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const router = useRouter();
  const Plat = require('@/assets/images/plats.jpg');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user.id) {
        console.log('User not logged in or user ID missing');
        return;
      }
      console.log('Fetching order history for user ID:', user.id);
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/commandes/liste-commande-client', {
          params: {
            userId: user.id, // Ensure this is the correct parameter name
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log('Order history response:', response.data);
        if (response.data.statut === 'succes') {
          setOrderHistory(response.data.resultat);
        } else {
          console.error('API returned an error:', response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch order history:', error.response ? error.response.data : error.message);
      }
    };

    const fetchOrderStatuses = async () => {
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/configuration/liste-etat-commande');
        setOrderStatuses(response.data.resultat);
      } catch (error) {
        console.error('Failed to fetch order statuses:', error.response ? error.response.data : error.message);
      }
    };

    fetchOrderHistory();
    fetchOrderStatuses();
  }, [user, token]);

  const getOrderStatus = (id) => {
    const status = orderStatuses.find(status => status.id === id);
    return status ? status.libelle : 'Unknown';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={Plat} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>Commande N°: {item.id}</Text>
        <Text style={styles.subtitle}>Nombre de produits: {item.liste_produit.length}</Text>
        <Text style={styles.subtitle}>État de la commande: {getOrderStatus(item.etat_id)}</Text>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push({ pathname: 'orderDetails', params: { order: item } })}
        >
          <Text style={styles.detailsButtonText}>Voir les détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Historique des commandes",
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.containerView}>
          {orderHistory.length === 0 ? (
            <Text style={styles.emptyMessage}>Aucune commande passée.</Text>
          ) : (
            <FlatList
              data={orderHistory}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerView: {
    padding: 25,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 13,
  },
  card: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#7f7f7f',
    marginTop: 5,
  },
  detailsButton: {
    backgroundColor: '#8b8745',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
