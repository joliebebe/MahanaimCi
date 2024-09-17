import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Colors from '@/constants/Colors';
import DropdownList from './DropdownList';

type Props = {
  onCategoryChange: (category: string) => void;
  setShowDropdown: (show: boolean) => void;
  handleCategoryChange: (category: string) => void;
};

const CategoryButtons = ({ onCategoryChange, setShowDropdown, handleCategoryChange }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
        const categoriesData = response.data.resultat.categories;
        setCategories(categoriesData);
        console.log('categoriesData',categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (index: number) => {
    if (activeIndex === index) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setActiveIndex(index);
      setDropdownOpen(true);
      onCategoryChange(categories[index].libelle);
      setShowDropdown(true);
    }

    const selected = itemRef.current[index];
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX, y: 0, animated: true });
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.bgColorsgreen} />;
  }

  const selectedCategoryDetails = categories[activeIndex]?.sous_categories || [];

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 5, marginBottom: 10 }}
      >
        {categories.map((category, index) => (
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
      {dropdownOpen && selectedCategoryDetails.length > 0 && (
        <DropdownList
          onCategoryChange={onCategoryChange}
          onCategoryProd={(categoryProd: string) => {
            console.log('catP', categoryProd);
          }}
          onCategoryResto={(categoryResto: string) => {
            console.log('Res', categoryResto);
          }}
          selectedCategoryTitle={categories[activeIndex].libelle}
          categoryDetails={selectedCategoryDetails}
        />
      )}
    </View>
  );
};

export default CategoryButtons;

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
    color: Colors.white,
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
