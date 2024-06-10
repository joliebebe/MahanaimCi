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
    const [selectedOptionProd, setSelectedOptionProd] = useState<number | null>(null);
    const [selectedOptionResto, setSelectedOptionResto] = useState<number | null>(null);
    const [isOpenProd, setIsOpenProd] = useState<boolean[]>([]);
    const [isOpenResto, setIsOpenResto] = useState<boolean[]>([]);
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
                setIsOpenProd(Array(category.sous_categories.length).fill(false));
                setIsOpenResto(Array(category.sous_categories.length).fill(false));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            setLoading(false);
        }
    };

    const handleOptionSelect = (index: number, type: string) => {
        if (type === 'prod') {
            const updatedIsOpenProd = [...isOpenProd];
            updatedIsOpenProd[index] = !updatedIsOpenProd[index];
            setIsOpenProd(updatedIsOpenProd);
            setSelectedOptionProd(index);
            onCategoryProd(subCategories[index].libelle);
        } else if (type === 'resto') {
            const updatedIsOpenResto = [...isOpenResto];
            updatedIsOpenResto[index] = !updatedIsOpenResto[index];
            setIsOpenResto(updatedIsOpenResto);
            setSelectedOptionResto(index);
            onCategoryResto(subCategories[index].libelle);
        }

        onCategoryChange(selectedCategoryTitle);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {selectedCategoryTitle === "Resto" && (
                subCategories.map((item: any, index: number) => (
                    <View key={index}>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect(index, 'resto')}
                            style={styles.header}
                        >
                            <Text style={styles.headerText}>{item.libelle}</Text>
                            <Ionicons style={styles.icon} name={isOpenResto[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                        </TouchableOpacity>
                        {isOpenResto[index] && (
                            <View style={styles.optionsContainer}>
                                <CategoryDetailsButtons
                                    onCategoryDetailsChange={onCategoryChange}
                                    CategoriesDetails={item.produits}
                                />
                            </View>
                        )}
                    </View>
                ))
            )}
            {selectedCategoryTitle === "Marque de produit locaux" && (
                subCategories.map((item: any, index: number) => (
                    <View key={index}>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect(index, 'prod')}
                            style={styles.header}
                        >
                            <Text style={styles.headerText}>{item.libelle}</Text>
                            <Ionicons style={styles.icon} name={isOpenProd[index] ? 'chevron-down-outline' : 'chevron-forward'} size={20} color="black" />
                        </TouchableOpacity>
                        {isOpenProd[index] && (
                            <View style={styles.optionsContainer}>
                                <CategoryDetailsButtons
                                    onCategoryDetailsChange={onCategoryChange}
                                    CategoriesDetails={item.produits}
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
