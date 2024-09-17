import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CategoryDetailsButtons from './CategoryDetailsButtons';

type Props = {
  onCategoryChange: (category: any) => void;
  selectedCategoryTitle: string;
  categoryDetails: any[];
};

const DropdownList = ({ onCategoryChange, selectedCategoryTitle, categoryDetails = [] }: Props) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOpen(Array(categoryDetails.length).fill(false));
  }, [categoryDetails]);

  const handleOptionSelect = (index: number) => {
    const updatedIsOpen = [...isOpen];
    updatedIsOpen[index] = !updatedIsOpen[index];
    setIsOpen(updatedIsOpen);
    setSelectedOption(index);

    onCategoryChange(categoryDetails[index]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {categoryDetails.length > 0 ? (
        categoryDetails.map((item: any, index: number) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() => handleOptionSelect(index)}
              style={styles.header}
            >
              <Text style={styles.headerText}>{item.libelle}</Text>
              <Ionicons style={styles.icon} name={isOpen[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
            </TouchableOpacity>
            {isOpen[index] && (
              <View style={styles.optionsContainer}>
                <CategoryDetailsButtons
                  onCategoryDetailsChange={onCategoryChange}
                  selectedCategory={item} // Pass the entire item object
                />
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>No categories available</Text>
      )}
    </View>
  );
};

export default DropdownList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fbfbfb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  headerText: {
    fontFamily: 'TimesNewRoman',
    fontSize: 16,
    marginRight: 'auto',
  },
  icon: {
    marginLeft: 'auto',
  },
  optionsContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
