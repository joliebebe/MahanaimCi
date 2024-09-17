import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { SearchBar } from '@rneui/themed';

const DropdownMenu = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [villes, setVilles] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [selectedVille, setSelectedVille] = useState(null);
    const [selectedSousCategorie, setSelectedSousCategorie] = useState(null);
    const [isOpen, setIsOpen] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);


    const updateSearch = (searchText) => {
        setSearch(searchText);
    };

    useEffect(() => {
        // Appelle à l'API pour récupérer les catégories
        setLoading(true);
        axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories')
            .then(response => {
                setCategories(response.data.resultat.categories);
            })
            .catch(error => console.error(error));
    }, []);
    useEffect(() => {
        // Filtrer les catégories selon la recherche
        if (search.trim()) {
            const filtered = categories.filter(category =>
                category.libelle.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories); // Remettre toutes les catégories si la recherche est vide
        }
    }, [search, categories]);

    const handleCategorySelect = (categorie_id) => {
        // Appelle à l'API pour récupérer villes et sous-catégories
        setLoading(true);
        axios.get(`https://api.mahanaiim.ci/api/client/ville-sous-categorie-par-categorie?categorie_id=${categorie_id}`)
            .then(response => {
                const { villes, sous_categories } = response.data.resultat;
                setVilles(villes);
                setSousCategories(sous_categories);
            })
            .catch(error => console.error(error));
    };

    const handleVilleSelect = (ville) => {
        setSelectedVille(ville);
        setSelectedSousCategorie(null); // Réinitialiser la sous-catégorie sélectionnée
    };

    const handleSousCategorieSelect = (sousCategorie) => {
        setSelectedSousCategorie(sousCategorie);
        setSelectedVille(null); // Réinitialiser la ville sélectionnée
        setIsOpen(prevState => ({ ...prevState, [sousCategorie.id]: !prevState[sousCategorie.id] }));
    };

    const renderItems = ({ item }) => (
        <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity>
                <View style={styles.item}>
                    <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }} style={styles.image} />
                    <View style={styles.iconView}>
                        <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/logo_prestataire/${item.logo_prestataire}` }} style={styles.icon} />
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <Ionicons name="person" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                        <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.libelle_prestataire}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <Ionicons name="location" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                        <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.localisation_produit}</Text>
                    </View>
                    <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
                    <Text style={styles.itemPrice}>{item.prix} fcfa</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const renderVilleItems = ({ item }) => (
        <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity>
                <View style={styles.item}>
                    <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }} style={styles.image} />
                    <View style={styles.iconView}>
                        <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/logo_prestataire/${item.logo_prestataire}` }} style={styles.icon} />
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <Ionicons name="person" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                        <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.libelle_prestataire}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <Ionicons name="location" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                        <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.localisation_produit}</Text>
                    </View>
                    <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
                    <Text style={styles.itemPrice}>{item.prix} fcfa</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
    return (
        <View style={styles.container}>
            <View style={styles.searchSectionWrapper}>
                <View style={styles.searchBar}>
                    <SearchBar
                        placeholder="Recherche ici"
                        lightTheme
                        value={search}
                        onChangeText={updateSearch}
                        showLoading={false}
                        round={true}
                        inputStyle={{ fontSize:'TimesNewRomanBold', color: '#fff', backgroundColor: Colors.bgColorsgreen, borderColor: Colors.bgColorsgreen }}
                        errorStyle={{ color: 'red' }}
                        //errorMessage='Introuvable' 
                        inputContainerStyle={{ backgroundColor: Colors.bgColorsgreen }}
                        placeholderTextColor={'#fff'}
                        searchIcon={{ color: '#fff' }}
                        clearIcon={{ color: '#fff' }}
                        leftIconContainerStyle={{}}
                        containerStyle={{
                            backgroundColor: '#fcfeed',
                            justifyContent: 'space-around',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                        }}
                    />
                </View>
            </View>

            {/* Affichage des catégories filtrées */}
            <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 10 }}>
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => handleCategorySelect(category.id)}
                            style={[
                                styles.categoryBtn,
                                selectedCategory === category.id ? styles.categoryBtnActive : styles.categoryBtnInactive
                            ]}
                        >
                            <Text style={styles.categoryTextBtn}>{category.libelle.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyMessage}>Aucune catégorie trouvée.</Text>
                )}
            </ScrollView>

            {/* Affichage des villes ou sous-catégories */}
            <View>
                {villes.length > 0 ? (
                    <View>
                        <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 10 }}>
                            {villes.map((ville) => (
                                <TouchableOpacity
                                    key={ville.id}
                                    onPress={() => handleVilleSelect(ville)}
                                    style={[
                                        styles.categoryBtn,
                                        selectedVille && selectedVille.id === ville.id ? styles.categoryBtnActive : styles.categoryBtnInactive
                                    ]}
                                >
                                    <Text style={styles.categoryTextBtn}>{ville.ville.toUpperCase()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Affichage des produits pour la ville sélectionnée */}
                        <View style={styles.optionsContainer}>
                            {selectedVille && selectedVille.produits.length > 0 ? (
                                <FlatList
                                    data={selectedVille.produits}
                                    renderItem={renderVilleItems}
                                    keyExtractor={item => item.id.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            ) : (
                                <Text style={styles.emptyMessage}>Aucun produit disponible pour le moment.</Text>
                            )}
                        </View>
                    </View>
                ) : (
                    <View>
                        {sousCategories.map((sousCategorie) => (
                            <View key={sousCategorie.id}>
                                <TouchableOpacity
                                    onPress={() => handleSousCategorieSelect(sousCategorie)}
                                    style={styles.header}
                                >
                                    <Text style={styles.headerText}>{sousCategorie.libelle.toUpperCase()}</Text>
                                    <Ionicons
                                        style={styles.icon}
                                        name={isOpen[sousCategorie.id] ? 'chevron-down-outline' : 'chevron-forward'}
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                                {isOpen[sousCategorie.id] && (
                                    <View style={styles.optionsContainer}>
                                        {selectedSousCategorie && selectedSousCategorie.produits.length > 0 ? (
                                            <FlatList
                                                data={selectedSousCategorie.produits}
                                                renderItem={renderItems}
                                                keyExtractor={item => item.id.toString()}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                            />
                                        ) : (
                                            <Text style={styles.emptyMessage}>Aucun produit disponible pour le moment.</Text>
                                        )}
                                    </View>
                                )}

                            </View>
                        ))}
                    </View>
                )}
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
       paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fbfbfb',
    },
    searchSectionWrapper: {
       // marginVertical: 20,
        fontFamily: 'TimesNewRoman',
        color: Colors.white,
    },
    searchBar: {
        borderRadius: 50,
        paddingHorizontal: 10,
    },
    categoryBtn: {
        flexDirection: 'row',
        textAlign: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowRadius: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        marginHorizontal: 5,  // Espacement horizontal
        marginVertical: 5,    // Espacement vertical
    },
    categoryTextBtn: {
        color: '#fff',
        fontFamily: 'TimesNewRomanBold',
    },
    categoryBtnInactive: {
        backgroundColor: '#336375',
        shadowColor: '#042e3f',
    },
    categoryBtnActive: {
        backgroundColor: '#5b6165',
        shadowColor: '#7c7c7e',
    },
    optionsContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyMessage: {
        fontFamily: 'TimesNewRomanBold',
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        padding: 20,
    },
    iconView: {
        position: 'absolute',
        top: 150,
        alignSelf: 'flex-end',
        right: 30,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 25,
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
    item: {
        backgroundColor: '#fff',
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
});


export default DropdownMenu;
