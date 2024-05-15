import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import DropdownList from './DropdownList';
import listingsData from '@/assets/data/details.json';

type Props = {
  onCategoryChange: (Category: string) => void;
  setShowDropdown: (show: boolean) => void;
};

const CategoryButtons = ({ onCategoryChange, setShowDropdown }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(TouchableOpacity | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Extraire les catégories uniques depuis les données des listings
  const categories = Array.from(new Set(listingsData.map(item => item.categories)));

  const handleSelectCategory = (index: number) => {
    if (activeIndex === index) {
      setDropdownOpen(!dropdownOpen);
    } else {
      setActiveIndex(index);
      setDropdownOpen(true);
      onCategoryChange(categories[index]);
      setShowDropdown(true);
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
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => (itemRef.current[index] = el)}
            onPress={() => handleSelectCategory(index)}
            style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
          >
            <Text style={styles.categoryTextBtn}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {activeIndex !== null && dropdownOpen && (
        <DropdownList
          onCategoryChange={onCategoryChange}
          onCategoryProd={(categoryProd: string) => {
            console.log(categoryProd);
          }}
          selectedCategoryIndex={activeIndex}
          selectedCategoryTitle={categories[activeIndex]}
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
