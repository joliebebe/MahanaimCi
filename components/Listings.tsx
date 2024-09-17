import React, { useEffect, useState, useCallback, memo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ListingType } from '@/types/listingType';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  selectedCategory: { id: number; libelle: string; };
};

const Listings = ({ selectedCategory }: Props) => {
  const [filteredListings, setFilteredListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);  // Start loading
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
        const categories = response.data.resultat.categories;  // Extraire le tableau `categories` de la réponse
        let produits = [];

        categories.forEach(category => {
          if (category.sous_categories) {
            category.sous_categories.forEach(sous_categorie => {
              if (sous_categorie.villes) {
                sous_categorie.villes.forEach(ville => {
                  if (ville.id === selectedCategory.id) {
                    produits = produits.concat(ville.produits);
                  }
                });
              }
            });
          }
        });

        setFilteredListings(produits);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces:', error);
      }
      setIsLoading(false);  // End loading
    };

    fetchData();
  }, [selectedCategory]);

  const renderItems = useCallback(({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }} style={styles.image} />
          <View style={styles.iconView}>
            <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/logo_prestataire/${item.logo_prestataire}` }} style={styles.icon} />
          </View>
          <View style={{flexDirection:'row', paddingBottom:10}}>
            <Ionicons name="person" size={20} color="#8b8745" style={{paddingRight:10}} />
            <Text style={[styles.itemDescript, {textTransform: 'uppercase'}]}>{item.libelle_prestataire}</Text>
          </View>
          <View style={{flexDirection:'row', paddingBottom:10}}>
            <Ionicons name="location" size={20} color="#8b8745" style={{paddingRight:10}} />
            <Text style={[styles.itemDescript, {textTransform: 'uppercase'}]}>{item.localisation_produit}</Text>
          </View>
          <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
          <Text style={styles.itemPrice}>{item.prix} fcfa</Text>
        </View>
      </TouchableOpacity>
    </Link>
  ), []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.bgColorsgreen} />
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderItems}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default memo(Listings);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    position: 'absolute',
    top: 150,
    alignSelf: 'flex-end',
    right: 30,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 25,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  item: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    width: 220,
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
    width: 200,
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTxt: {
    fontSize: 16,
    fontFamily: 'TimesNewRomanBold',
    fontWeight: 'bold',
  },
  itemDescript: {
    fontFamily: 'TimesNewRomanBold',
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemPrice: {
    fontFamily: 'TimesNewRoman',
    color: '#63f446',
    fontSize: 16,
    marginVertical: 5,
  },
});
