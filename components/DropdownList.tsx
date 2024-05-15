import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CategoriesProd from '@/assets/data/catProd'
import { Ionicons } from '@expo/vector-icons'
import CategoryDetailsButtons from './CategoryDetailsButtons';

type Props = {
    onCategoryProd: (CategoriesProd: string) => void;
    onCategoryChange: (category: string) => void;
    selectedCategoryTitle: string;
};
const DropdownList = ({ onCategoryProd, onCategoryChange, selectedCategoryTitle }: Props) => {

    const [selectedOption, setSelectedOption] = useState(0);
    const [isOpen, setIsOpen] = useState(Array(CategoriesProd.length).fill(false));

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
        onCategoryProd(CategoriesProd[index].title);
        console.log(index);
        onCategoryChange(selectedCategoryTitle);

    };

    const [categoryDetails, setCategoryDetails] = useState(0);

 // Ajouter un état pour suivre les détails de la catégorie sélectionnée
 const [selectedCategoryDetails, setSelectedCategoryDetails] = useState([]);

    const onCatgDetailsChanged = (CategoriesDetails: any, category: string) => {
        console.log("Selected category details:", CategoriesDetails);
        setSelectedCategoryDetails(CategoriesDetails);
        console.log("console category1:", category);
        setCategory(category);

    };
    const [category, setCategory] = useState('Ferké');

    return (
        <View style={styles.container}>
            {/* Boutons pour ouvrir/fermer le menu déroulant */}
            {CategoriesProd.map((item, index) => (
                <View key={index}>
                    <TouchableOpacity
                        onPress={() => handleOptionSelect(index)}
                        style={styles.header}
                    >
                        <Text style={styles.headerText}>{item.title}</Text>
                        <Ionicons style={styles.icon} name={isOpen[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                    </TouchableOpacity>
                    {/* Options du menu déroulant */}
                    {isOpen[index] && (
                        <View style={styles.optionsContainer}>
                            {index === 3 && (
                                <View style={styles.CategoryDetailsButtons} >
                                    <CategoryDetailsButtons onCategoryDetailsChange={onCatgDetailsChanged} />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            ))}
        </View>
    )
}

export default DropdownList

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
        alignItems: 'flex-start',
        fontFamily: 'TimesNewRoman',
        fontSize: 16,
        marginRight: 'auto',

    },
    icon: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end'

    },
    optionsContainer: {
        width: '100%',
        marginTop: 5,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 10,
    },
    CategoryDetailsButtons: {
        // marginHorizontal: 15,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
});