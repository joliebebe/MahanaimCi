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
    const [produits, setProduits] = useState([]);
    const [sousCategories, setSousCategories] = useState([]);
    const [selectedVille, setSelectedVille] = useState(null);
    const [selectedSousCategorie, setSelectedSousCategorie] = useState(null);
    const [isOpen, setIsOpen] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isOpenville, setIsOpenville] = useState({});

    // Fonction de mise à jour de la recherche
    const updateSearch = (searchText) => {
        setSearch(searchText);
    };

    // Appel API pour récupérer les catégories au chargement du composant
    useEffect(() => {
        setLoading(true);
        axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories')
            .then(response => {
                setCategories(response.data.resultat.categories); // On récupère toutes les catégories avec leurs sous-catégories et villes
                setLoading(false); // On arrête le chargement une fois les données reçues
            })
            .catch(error => {
                console.error(error);
                setLoading(false); // On arrête le chargement même en cas d'erreur
            });
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

    // Fonction de sélection d'une catégorie
    const handleCategorySelect = (categorie_id) => {
        // Filtrer les villes et sous-catégories à partir des données déjà chargées
        const selectedCategoryData = categories.find(category => category.id === categorie_id);
        if (selectedCategoryData) {
            setVilles(selectedCategoryData.villes || []); // On récupère les villes de la catégorie sélectionnée
            setSousCategories(selectedCategoryData.sous_categories || []); // On récupère les sous-catégories de la catégorie sélectionnée
            setSelectedCategory(categorie_id); // On met à jour la catégorie sélectionnée
        }
    };

    // Fonction qui gère la sélection d'une ville
    const handleVilleSelect = (ville) => {
        setSelectedVille(ville);
        setSelectedSousCategorie(null); // Réinitialiser la sous-catégorie
        fetchProduitsParVille(selectedCategory, ville.id); // Appel API pour récupérer les produits par ville et catégorie
        console.log('Catégorie ID ville.id:', ville.id);
        console.log('Catégorie ID selectedCategory:', selectedCategory);

    };

    // Fonction qui gère la sélection d'une ville et d'une sous-catégorie
    const handleVilleSousCategorieSelect = (ville, sous_categorie, categorie_id) => {
        setSelectedVille(ville);
        setSelectedSousCategorie(sous_categorie);

        console.log('Ville sélectionnée:', ville);
        console.log('Sous-catégorie sélectionnée:', sous_categorie);
        console.log('Catégorie ID:', categorie_id);

        // Appel API avec les bons paramètres
        fetchProduitsParSousCategorie(sous_categorie.id, categorie_id, ville.id);
    };

    // Fonction pour récupérer les produits par ville et catégorie
    const fetchProduitsParVille = (categorie_id, ville_id) => {
        setLoading(true);
        console.log('catégorie_id:', categorie_id);
        console.log('ville_id:', ville_id);

        axios.get(`https://api.mahanaiim.ci/api/client/liste-produit-fonction-categorie-ville?categorie_id=${categorie_id}&ville_id=${ville_id}`)
            .then(response => {
                console.log('Réponse de l\'API:', response.data);
                if (response.data.resultat && response.data.resultat.length > 0) {
                    const produits = response.data.resultat.map(produit => ({
                        ...produit,
                        ville_id: produit.ville_id, // Assurez-vous d'utiliser le bon champ
                        categorie_id: produit.categorie_id, // Assurez-vous d'utiliser le bon champ
                    }));
                    console.log('Produits récupérés:', produits);
                    setProduits(produits);
                } else {
                    console.log('Aucun produit trouvé dans la réponse.');
                    setProduits([]); // Mettre à jour l'état avec un tableau vide
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des produits par ville:', error);
                setLoading(false);
            });
    };

    // Récupérer les produits par sous-catégorie et catégorie
    const fetchProduitsParSousCategorie = (sous_categorie_id, categorie_id, ville_id) => {
        setLoading(true);
        axios.get(`https://api.mahanaiim.ci/api/client/liste-ville-par-categorie-et-sous-categorie?sous_categorie_id=${sous_categorie_id}&categorie_id=${categorie_id}&ville_id=${ville_id}`)
            .then(response => {
                const resultat = response.data.resultat || [];
                const produitsTrouves = [];

                resultat.forEach(ville => {
                    if (Array.isArray(ville.produits) && ville.produits.length > 0) {
                        const produitsAvecIds = ville.produits.map(produit => ({
                            ...produit,
                            ville_id: ville.id,
                            categorie_id: categorie_id,
                            sous_categorie_id: sous_categorie_id,
                        }));
                        produitsTrouves.push(...produitsAvecIds);
                    }
                });

                if (produitsTrouves.length > 0) {
                    setProduits(produitsTrouves);
                } else {
                    setProduits([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des produits par sous-catégorie:', error);
                setProduits([]);
                setLoading(false);
            });
    };

    const toggleSousCategorie = (id) => {
        setIsOpen(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const renderItems = ({ item }) => {
        console.log('item:', item);
        console.log('ville_id:', item.ville_id, 'categorie_id:', item.categorie_id, 'sous_categorie_id:', item.sous_categorie_id);
        return (
            <Link href={`/listing/${item.id}?ville_id=${item.ville_id}&categorie_id=${item.categorie_id}&sous_categorie_id=${item.sous_categorie_id}`} asChild>
                <TouchableOpacity>
                    <View style={styles.item}>
                        {/* Ensure that item has valid image, logo_prestataire, etc */}
                        <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }} style={styles.image} />
                        <View style={styles.iconView}>
                            <Image source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/logo_prestataire/${item.logo_prestataire}` }} style={styles.icon1} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, paddingTop: 10 }}>
                            <Ionicons name="person" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                            <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.libelle_prestataire}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                            <Ionicons name="location" size={20} color="#8b8745" style={{ paddingRight: 10 }} />
                            <Text style={[styles.itemDescript, { textTransform: 'uppercase' }]}>{item.localisation}</Text>
                        </View>
                        <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
                        <Text style={styles.itemPrice}>{item.prix} fcfa</Text>
                    </View>
                </TouchableOpacity>
            </Link>
        )
    };
    useEffect(() => {
        // Simuler le chargement des données
        const loadData = async () => {
            // Remplacez ceci par votre logique de chargement
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai de chargement
            setLoading(false); // Fin du chargement
        };
        loadData();
    }, []);

    const toggleVille = (villeId) => {
        setIsOpenville(prevState => ({ ...prevState, [villeId]: !prevState[villeId] }));
    };

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
                        inputStyle={{ fontFamily: 'TimesNewRomanBold', color: '#fff', backgroundColor: Colors.bgColorsgreen, borderColor: Colors.bgColorsgreen }}
                        errorStyle={{ color: 'red' }}
                        inputContainerStyle={{ backgroundColor: Colors.bgColorsgreen }}
                        placeholderTextColor={'#fff'}
                        searchIcon={{ color: '#fff' }}
                        clearIcon={{ color: '#fff' }}
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

            {/* Affichage des sous-catégories et villes */}
            <View>
                {sousCategories.map((sousCategorie) => (
                    <View key={sousCategorie.id.toString()}>
                        <TouchableOpacity onPress={() => toggleSousCategorie(sousCategorie.id)} style={styles.header}>
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
                                {/* Affichage des villes dans la sous-catégorie */}
                                {sousCategorie.villes && sousCategorie.villes.length > 0 ? (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                                        {sousCategorie.villes.map((ville) => (
                                            <TouchableOpacity
                                                key={ville.id.toString()}
                                                onPress={() => {
                                                    handleVilleSousCategorieSelect(ville, sousCategorie, selectedCategory);
                                                    setSelectedVille(ville); // Mise à jour de la ville sélectionnée
                                                    setSelectedSousCategorie(sousCategorie); // Mise à jour de la sous-catégorie sélectionnée
                                                    toggleVille(ville.id); // Ajouter l'effet d'ouverture/fermeture
                                                }}
                                                style={[
                                                    styles.categoryBtn,
                                                    selectedSousCategorie && selectedVille && selectedVille.id === ville.id ? styles.categoryBtnActive : styles.categoryBtnInactive
                                                ]}
                                            >
                                                <Text style={styles.categoryTextBtn}>
                                                    {ville.libelle ? ville.libelle.toUpperCase() : 'Ville non définie'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <Text style={styles.emptyMessage}>Aucune ville disponible pour le moment.</Text>
                                )}

                                {/* Affichage des produits pour la ville et sous-catégorie sélectionnées */}
                                {selectedVille && selectedSousCategorie && (
                                    <View style={styles.optionsContainer1}>
                                        {produits.length > 0 ? (
                                            <FlatList
                                                data={produits.filter(prod => prod.ville_id === selectedVille.id)} // Filtrer les produits par ville
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
                        )}
                    </View>
                ))}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    villes.length > 0 && (
                        <View>
                            <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 10 }}>
                                {villes.map((ville) => (
                                    <TouchableOpacity
                                        key={ville.id.toString()}
                                        onPress={() => {
                                            handleVilleSelect(ville); // Sélectionnez la ville
                                            toggleVille(ville.id); // Ajouter l'effet d'ouverture/fermeture
                                        }}
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
                            <View style={styles.optionsContainer1}>
                                {selectedVille ? (
                                    produits.filter(produit => produit.ville_id === selectedVille.id).length > 0 ? (
                                        <FlatList
                                            data={produits.filter(produit => produit.ville_id === selectedVille.id)} // Assurez-vous que 'ville_id' est correct
                                            renderItem={renderItems}
                                            keyExtractor={item => item.id.toString()}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    ) : (
                                        <Text style={styles.emptyMessage}>Aucun produit disponible pour cette ville.</Text>
                                    )
                                ) : (
                                    <Text style={styles.emptyMessage}>Veuillez sélectionner une ville.</Text>
                                )}
                            </View>
                        </View>
                    ))
                }
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 10,
    },
    headerText: {
        fontFamily: 'TimesNewRomanBold',
        fontSize: 16,
        marginRight: 'auto',
        color: Colors.primaryColorblue,
    },
    icon: {
        marginLeft: 'auto',

    },
    icon1: {
        marginLeft: 'auto',
        width: 45,
        height: 45,
        borderRadius: 100,
        bottom: 20,
        borderWidth: 2,
        borderColor: '#fff',
        left: 10,
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
        color: Colors.bgColorsprice,
        fontSize: 16,
        marginVertical: 5,
    },
});


export default DropdownMenu;
