import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useNavigation, useRouter } from 'expo-router';
import axios from 'axios';
import { useUser } from '@/context/UserContext'; // Assurez-vous d'ajuster l'import selon l'emplacement réel de UserContext

const Notification = () => {
  const { user, token } = useUser();
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true); // État pour gérer l'affichage de chargement
  const router = useRouter();
  const Plat = require('@/assets/images/plats.jpg');
  const navigation = useNavigation();
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user.id) {
        console.log('Utilisateur non connecté ou ID utilisateur manquant');
        setLoading(false); // Définir loading à false pour afficher un message par défaut
        return;
      }
      console.log('Récupération de l\'historique des commandes pour l\'utilisateur ID:', user.id);
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/commandes/liste-commande-client', {
          params: {
            userId: user.id, // Assurez-vous que c'est le bon nom de paramètre
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log('Réponse de l\'historique des commandes:', response.data);
        if (response.data.statut === 'succes') {
          setOrderHistory(response.data.resultat);
        } else {
          console.error('L\'API a retourné une erreur:', response.data.message);
        }
      } catch (error) {
        console.error('Échec de récupération de l\'historique des commandes:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false); // Définir loading à false après l'appel API
      }
    };

    const fetchOrderStatuses = async () => {
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/configuration/liste-etat-commande');
        setOrderStatuses(response.data.resultat);
      } catch (error) {
        console.error('Échec de récupération des états des commandes:', error.response ? error.response.data : error.message);
      }
    };

    fetchOrderHistory();
    fetchOrderStatuses();
  }, [user, token]);

  const getOrderStatus = (id) => {
    const status = orderStatuses.find(status => status.id === id);
    return status ? status.libelle : 'Inconnu';
  };

  const renderItem = ({ item }) => {
    console.log('Rendu de l\'élément:', item);
    return (
      <View style={styles.card}>
        <Image source={Plat} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>Commande N°: {item.id}</Text>
          {item.liste_produit && (
            <Text style={styles.subtitle}>Nombre de produits: {item.liste_produit.length}</Text>
          )}
          <Text style={styles.subtitle}>État de la commande: {getOrderStatus(item.etat)}</Text>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => navigation.navigate('OrderDetails', { order: item })}
          >
            <Text style={styles.detailsButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Message par défaut lors du chargement ou si aucune commande n'a été trouvée
  const defaultMessage = loading ? "Chargement en cours..." : "Aucune commande passée.";

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
            <Text style={styles.emptyMessage}>{defaultMessage}</Text>
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
