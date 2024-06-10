import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ListingType } from '@/types/listingType';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';

type Props = {
  listings: ListingType[];
  selectedCategory: { id: string; destination: string; };
};

const Listings = ({ listings, selectedCategory }: Props) => {
  const [filteredListings, setFilteredListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);  // Start loading
    setTimeout(() => {  // Simulate a network request or any async operation
      if (selectedCategory && selectedCategory.id) {
        const filtered = listings.filter(item => item.categoryId === selectedCategory.id);
        setFilteredListings('filtre', filtered);
        console.log(setFilteredListings);
      } else {
        setFilteredListings(listings);
      }
      setIsLoading(false);  // End loading
    }, 1000);  // You can adjust the delay as needed
  }, [selectedCategory, listings]);

  const renderItems: ListRenderItem<ListingType> = ({ item }) => (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.iconView}>
            <Image source={{ uri: item.icon }} style={styles.icon} />
          </View>
          <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.itemDescript}>{item.description}</Text>
          <Text style={styles.itemPrice}>{item.price} fcfa/Kg</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.bgColorsgreen} />
      ) : (
        <FlatList
          data={filteredListings}
          renderItem={renderItems}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 30,
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
  itemTxt: {
    fontSize: 16,
    fontFamily: 'TimesNewRomanBold',
    fontWeight: 'bold',
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
});