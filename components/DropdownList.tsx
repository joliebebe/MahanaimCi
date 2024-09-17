import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import CategoryDetailsButtons from './CategoryDetailsButtons';

type Props = {
    onCategoryProd: (categoryProd: string) => void;
    onCategoryResto: (categoryResto: string) => void;
    onCategoryChange: (category: string) => void;
    selectedCategoryTitle: string;
    categoryDetails: any[];
};

const DropdownList = ({ onCategoryProd, onCategoryResto, onCategoryChange, selectedCategoryTitle, categoryDetails }: Props) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean[]>([]);
    const [loading, setLoading] = useState(true);
    const [subCategories, setSubCategories] = useState<any[]>([]);

    useEffect(() => {
        if (selectedCategoryTitle) {
            fetchSubCategories(selectedCategoryTitle);
        }
    }, [selectedCategoryTitle]);

    const fetchSubCategories = async (categoryTitle: string) => {
        setLoading(true);
        try {
            const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
            const category = response.data.resultat.categories.find((cat: any) => cat.libelle === categoryTitle);
            if (category) {
                setSubCategories(category.sous_categories);
                setIsOpen(Array(category.sous_categories.length).fill(false));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setLoading(false);
        }
    };

    const handleOptionSelect = (index: number, type: string) => {
        const updatedIsOpen = [...isOpen];
        updatedIsOpen[index] = !updatedIsOpen[index];
        setIsOpen(updatedIsOpen);
        setSelectedOption(index);

        if (type === 'prod') {
            onCategoryProd(subCategories[index].libelle);
        } else if (type === 'resto') {
            onCategoryResto(subCategories[index].libelle);
        }

        onCategoryChange(selectedCategoryTitle);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {subCategories.map((item: any, index: number) => (
                <View key={index}>
                    <TouchableOpacity
                        onPress={() => handleOptionSelect(index, selectedCategoryTitle === 'Resto' ? 'resto' : 'prod')}
                        style={styles.header}
                    >
                        <Text style={styles.headerText}>{item.libelle}</Text>
                        <Ionicons style={styles.icon} name={isOpen[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                    </TouchableOpacity>
                    {isOpen[index] && (
                        <View style={styles.optionsContainer}>
                            <CategoryDetailsButtons
                                onCategoryDetailsChange={onCategoryChange}
                                selectedSubCategory={item} // Pass the selected sub-category
                            />
                        </View>
                    )}
                </View>
            ))}
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
