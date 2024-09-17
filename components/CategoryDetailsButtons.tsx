import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Listings from './Listings';

type Props = {
  onCategoryDetailsChange: (category: any) => void;
  selectedSubCategory: any; // Pass the selected sub-category
};

const CategoryDetailsButtons = ({ onCategoryDetailsChange, selectedSubCategory }: Props) => {
  const [categoriesDetails, setCategoriesDetails] = useState<any[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<TouchableOpacity[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-villes');
        const villes = response.data.resultat; // Extraction du tableau `resultat` de la réponse
        setCategoriesDetails(villes); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectSubCategory = (index: number) => {
    if (activeIndex === index) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setActiveIndex(index);
      setDropdownOpen(true);
      onCategoryDetailsChange(categoriesDetails[index]);
    }

    const selected = itemRef.current[index];
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX, y: 0, animated: true });
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 5, marginBottom: 10 }}
      >
        {categoriesDetails.map((categoryDetail, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectSubCategory(index)}
            style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
          >
            <Text style={styles.categoryTextBtn}>{categoryDetail.libelle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {activeIndex !== null && dropdownOpen && (
        <Listings
          selectedCategory={categoriesDetails[activeIndex]} // Pass the selected category details
        />
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
