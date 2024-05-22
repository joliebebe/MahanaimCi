import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Listings from './Listings';

type Props = {
    onCategoryDetailsChange: (CategoriesDetails: any, category: any) => void;
    CategoriesDetails: any[];
};

const CategoryDetailsButtons = ({ onCategoryDetailsChange, CategoriesDetails }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<TouchableOpacity[] | null[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(CategoriesDetails[0] || {});

    const handleSelectCategory = (index: number) => {
        const selected = itemRef.current[index];

        setActiveIndex(index);

        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x, y: 0, animated: true });
        });

        const category = CategoriesDetails[index];
        setSelectedCategory(category);
        onCategoryDetailsChange(category, category.destination);
        console.log('category',category);
    };
console.log('handleSelectCategory',handleSelectCategory);
    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 25, marginBottom: 10 }}
            >
                {CategoriesDetails.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        ref={(el) => (itemRef.current[index] = el)}
                        onPress={() => handleSelectCategory(index)}
                        style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
                    >
                        <Text style={activeIndex === index ? styles.textBtnActive : styles.textBtn}>
                            {item.destination}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Passer la catégorie sélectionnée à Listings */}
            <Listings listings={selectedCategory.listings || []} selectedCategory={selectedCategory} />
        </View>
    );
};

export default CategoryDetailsButtons;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
    },
    categoryBtn: {
        flexDirection: 'row',
        textAlign: 'center',
        backgroundColor: '#336375',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowRadius: 3,
    },
    textBtn: {
        color: '#fff',
        fontFamily: 'TimesNewRoman',
    },
    categoryBtnActive: {
        flexDirection: 'row',
        textAlign: 'center',
        backgroundColor: '#5b6165',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowRadius: 3,
    },
    textBtnActive: {
        color: '#fff',
        fontFamily: 'TimesNewRoman',
        fontWeight: 'bold',
    },
});
