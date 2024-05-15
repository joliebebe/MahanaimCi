import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, ListRenderItem, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack } from 'expo-router'
import { useHeaderHeight } from '@react-navigation/elements'
import Colors from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CategoryButtons from '../../components/CategoryButtons'
//import DropdownList from '@/components/DropdownList'
import CarouselScreen from '@/components/carousel';
import { modalType } from '@/types/modalType'
import modalData from '@/assets/data/modal.json';
import listingsData from '@/assets/data/details.json';

import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
    listings: any[];
    category: string;
    modal: string;
};
const Page = () => {
    const headerHeight = useHeaderHeight();
    const [category, setCategory] = useState('Resto');

    const onCatChanged = (category: string) => {
        console.log("console category:", category);
        setCategory(category);
         // Logique de traitement du clic sur le bouton de catégorie
         setShowDropdown(true); // Met à jour l'état pour afficher le DropdownList
         //console.log("set",setShowDropdown)

    };
   

    const [selectedOption, setSelectedOption] = useState('SOUMARA');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleCategorySelect = (CategoriesProd: any) => {
        console.log("Catégorie sélectionnée :", CategoriesProd);
        setSelectedOption("CategoriesProd:",CategoriesProd);
    };

    const renderItems: ListRenderItem<modalType> = ({ item }) => {
        return (
            <Link href={`/modal/${item.id}`} asChild>
                <TouchableOpacity>
                    <View style={styles.item}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.image}
                        />
                        <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail"> {item.name}</Text>
                        <Text style={styles.itemPrice} >{item.price}</Text>
                    </View>
                </TouchableOpacity>
            </Link>

        );
    };

       // Filtrer les listings en fonction de la catégorie sélectionnée
       const filteredDetails = listingsData.filter(item => item.categories === category);


    return (
        <SafeAreaProvider>
            <ScrollView>
                <>
                    <LinearGradient
                        colors={["#FFFFFF", Colors.bgColorspage]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.container, { paddingTop: headerHeight }]}
                    >
                        <View >
                            <View style={{ margin: 5, marginHorizontal: 15, paddingTop: 12 }}>
                                <Text style={styles.titre}>
                                    Akwaba, <Text style={styles.titre}>N'Guess</Text>
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' }}>
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.titre} >Bienvenue sur le marché{'\n'}MAHANAIIM.CI</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../assets/images/mon-icone.png')} style={styles.icon} />
                                </View>
                            </View>

                            <View style={styles.searchSectionWrapper} >
                                <View style={styles.searchBar} >
                                    <TextInput placeholder="Recherche ici" placeholderTextColor="#fff" style={{ flex: 1, color: Colors.white }} />
                                    <Ionicons name='search' size={24} style={{ marginLeft: 10, color: Colors.white }} />
                                </View>
                            </View>
                            <CategoryButtons onCategoryChange={onCatChanged} setShowDropdown={setShowDropdown} />

                            <View style={styles.guideContainer}>
                                <Text style={styles.guideText}>Guide de fonctionnement</Text>
                            </View>

                        </View>
                        <View style={styles.container1}>
                            <CarouselScreen onCategoryChanged={onCatChanged} />
                        </View>

                        <View style={styles.Prestation}>
                            <Text style={styles.PrestationText1}>Prestation Pro</Text>
                            <Text style={styles.PrestationText2}>Plus</Text>
                        </View>

                        <View style={{ margin: 5, marginHorizontal: 15, marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'TimesNewRoman', fontSize: 20 }}>
                                Nous envoyons des professionnels à votre porte, selon votre delai et votre budget
                            </Text>
                        </View>
                    </LinearGradient>
                    <View>
                        <FlatList
                            data={modalData}
                            renderItem={renderItems}
                            horizontal
                            showsHorizontalScrollIndicator={false} />
                    </View>




                </>
            </ScrollView>
        </SafeAreaProvider>

    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,

    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    container1: {
        flex: 1,
        backgroundColor: '#fcfeed',
    },
    titre: {
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'TimesNewRomanBold'
    },
    searchSectionWrapper: {
        marginVertical: 20,
        fontFamily: 'TimesNewRoman',
        color: Colors.white,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: Colors.bgColorsgreen,
        borderRadius: 10,
        padding: 10,

    },
    scrollContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingBottom: 15,
    },
    guideContainer: {
        backgroundColor: '#8b8745',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 15,
        marginHorizontal: 15,

    },
    guideText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'TimesNewRomanBold',
        margin: 6,
    },
    Prestation: {
        flexDirection: 'row',
        backgroundColor: '#8b8745',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
        marginHorizontal: 15,
        alignItems: 'center',

    },
    PrestationText1: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'TimesNewRoman',
        margin: 6,
        flex: 1,
    },
    PrestationText2: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 20,
        fontFamily: 'TimesNewRoman',
    },
    item: {
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 10,
        width: 170,
        borderColor: '#ccc',
        shadowColor: '#ccc',
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
        margin: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,

    },

    itemTxt: {
        fontSize: 16,
        fontFamily: 'TimesNewRomanBold',
        fontWeight: 'bold',
        // marginVertical:15
    },
    itemDescript: {
        fontFamily: 'TimesNewRomanBold',
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemPrice: {
        fontFamily: 'TimesNewRoman',
        color: '#63f446',
        fontSize: 16,
        marginVertical: 5,
    },
})