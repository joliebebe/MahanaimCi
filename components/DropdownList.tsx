import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import CategoriesProd from '@/assets/data/catProd';
import CategoriesResto from '@/assets/data/catResto';
import { Ionicons } from '@expo/vector-icons';
import CategoryDetailsButtons from './CategoryDetailsButtons';

type Props = {
    onCategoryProd: (categoryProd: string) => void;
    onCategoryResto: (categoryResto: string) => void;
    onCategoryChange: (category: string) => void;
    selectedCategoryTitle: string;
    categoryDetails: any[];
    //onCategoryDetailsChange: (CategoriesDetails: any, category: any) => void;
};

const DropdownList = ({ onCategoryProd,  onCategoryResto, onCategoryChange, selectedCategoryTitle, categoryDetails }: Props) => {
    const [selectedOptionProd, setSelectedOptionProd] = useState<number | null>(null);
    const [selectedOptionResto, setSelectedOptionResto] = useState<number | null>(null);
    const [isOpenProd, setIsOpenProd] = useState(Array(CategoriesProd.length).fill(false));
    const [isOpenResto, setIsOpenResto] = useState(Array(CategoriesResto.length).fill(false));

    const handleOptionSelect = (index: number, type: string) => {
        if (type === 'prod') {
            const updatedIsOpenProd = [...isOpenProd];
            updatedIsOpenProd[index] = !updatedIsOpenProd[index];
            setIsOpenProd(updatedIsOpenProd);
            setSelectedOptionProd(index);
            onCategoryProd(CategoriesProd[index].title);
            console.log('onCatP',CategoriesProd);
        } else if (type === 'resto') {
            const updatedIsOpenResto = [...isOpenResto];
            updatedIsOpenResto[index] = !updatedIsOpenResto[index];
            setIsOpenResto(updatedIsOpenResto);
            setSelectedOptionResto(index);
            onCategoryResto(CategoriesResto[index].title);
        }

        onCategoryChange(selectedCategoryTitle);

    };

    const filteredCategoryDetails = categoryDetails || [];

    return (
        <View style={styles.container}>
            {selectedCategoryTitle === "Resto" && (
                CategoriesResto.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect(index, 'resto')}
                            style={styles.header}
                        >
                            <Text style={styles.headerText}>{item.title}</Text>
                            <Ionicons style={styles.icon} name={isOpenResto[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                        </TouchableOpacity>
                        {isOpenResto[index] && (
                            <View style={styles.optionsContainer}>
                                <CategoryDetailsButtons
                                    onCategoryDetailsChange={onCategoryChange}
                                    
                                    CategoriesDetails={filteredCategoryDetails.filter(detail => detail.categories === "Resto")}
                                />
                            </View>
                        )}
                    </View>
                ))
            )}
            {selectedCategoryTitle === "Produits et Marques locales" && (
                CategoriesProd.map((item, index) => (
                    <View key={index}>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect(index, 'prod')}
                            style={styles.header}
                        >
                            <Text style={styles.headerText}>{item.title}</Text>
                            <Ionicons style={styles.icon} name={isOpenProd[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                        </TouchableOpacity>
                        {isOpenProd[index] && (
                            <View style={styles.optionsContainer}>
                                <CategoryDetailsButtons
                                    onCategoryDetailsChange={onCategoryChange}
                                    CategoriesDetails={filteredCategoryDetails.filter(detail => detail.categories === "Produits et Marques locales")}
                                />
                            </View>
                        )}
                    </View>
                ))
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
        width: '100%',
        marginTop: 5,
    },
    CategoryDetailsButtons: {
        backgroundColor: '#fff',
        paddingTop: 20,
    },
});
