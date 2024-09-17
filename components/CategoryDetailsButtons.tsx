import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Listings from './Listings';

type Props = {
  onCategoryDetailsChange: (category: any) => void;
  selectedSubCategory: any; // Pass the selected sub-category
};

const CategoryDetailsButtons = ({ onCategoryDetailsChange, selectedSubCategory }: Props) => {
  const [CategoriesDetails, setCategoriesDetails] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<TouchableOpacity[] | null[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-villes');
        const villes = response.data.resultat; // Extract the `resultat` array from the response
        setCategoriesDetails(villes);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectCategory = (index: number) => {
    if (activeIndex === index) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setActiveIndex(index);
      setDropdownOpen(true);
      onCategoryDetailsChange(CategoriesDetails[index]);
    }

    const selected = itemRef.current[index];
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
    });
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 5, marginBottom: 10 }}
      >
        {CategoriesDetails.map((category, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
          >
            <Text style={styles.categoryTextBtn}>{category.libelle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {activeIndex !== null && dropdownOpen && (
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Listings
              selectedCategory={selectedSubCategory.villes.find((ville: any) => ville.id === CategoriesDetails[activeIndex].id)}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default CategoryDetailsButtons;

const styles = StyleSheet.create({
  categoryBtn: {
    flexDirection: 'row',
    textAlign: 'center',
    backgroundColor: '#336375',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowRadius: 3,
    shadowColor: '#042e3f',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
  },
  categoryTextBtn: {
    color: '#fff',
    fontFamily: 'TimesNewRomanBold',
  },
  categoryBtnActive: {
    flexDirection: 'row',
    textAlign: 'center',
    backgroundColor: '#5b6165',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowRadius: 3,
    shadowColor: '#7c7c7e',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
  },
});
