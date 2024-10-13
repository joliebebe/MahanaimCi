import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryButtons from '../../components/CategoryButtons';
import CarouselScreen from '@/components/carousel';
import { modalType } from '@/types/modalType';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContext } from '@/context/UserContext';
import { ImageContext } from '@/context/ImageContext';
import axios from 'axios';
import { SearchBar } from '@rneui/themed';
import { color } from '@rneui/base';
import DropdownMenu from '@/components/DropdownMenu';

const Page = () => {
    const headerHeight = useHeaderHeight();
    const { user } = useContext(UserContext);
    const { selectedImage } = useContext(ImageContext);
    const [modalData, setModalData] = useState<modalType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    };
    useEffect(() => {
        fetchPrestationsPro();
    }, []);

    const fetchPrestationsPro = async () => {
        try {
            const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
            const prestationsPro = response.data.resultat.prestations_pro;
            setModalData(prestationsPro);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching prestations pro:", error);
            setLoading(false);
        }
    };

    const renderItems = ({ item }) => (
        <Link href={`/modal/${item.id}`} asChild>
            <TouchableOpacity>
                <View style={styles.item}>
                    <Image
                        source={{ uri: `https://api.mahanaiim.ci/backend/public/fichiers/${item.image}` }}
                        style={styles.image}
                    />
                    <Text style={styles.itemTxt} numberOfLines={1} ellipsizeMode="tail">{item.libelle}</Text>
                    <Text style={styles.itemPrice}>{item.valeur}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const handleCategoryChange = (category: string) => {
        console.log("Selected category:", category);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                }}
            />
            <SafeAreaProvider>
                <ScrollView>
                    <LinearGradient
                        colors={["#FFFFFF", Colors.bgColorspage]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.container}
                    >
                        <View>
                            <View style={{ margin: 5, marginHorizontal: 15, paddingTop: 25 , bottom:22}}>
                               {/*  <Text style={styles.titre}>
                                    Akwaba, {user && user.nom ? <Text style={styles.titre}>{user.nom}</Text> : "Utilisateur"}
                                </Text> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.titre}>Bienvenue, {user && user.nom ? <Text style={styles.titre}>{user.nom}</Text> : ""} {'\n'}sur le marché{'\n'}MAHANAIIM.CI</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    {selectedImage ? (
                                        <Image source={{ uri: selectedImage }} style={styles.icon} />
                                    ) : (
                                        <Image source={require('../../assets/images/mon-icone.png')} style={styles.icon} />
                                    )}
                                </View>
                            </View>
                           
                            {/* <CategoryButtons onCategoryChange={handleCategoryChange} setShowDropdown={setShowDropdown} /> */}
                            {/* 
                                ici je veux mettre un menu des boutons deroulante de droite à gauche
                                dit moi si je dois creer un nouveau fichier de menu et l'importer ici 
                            */}
                            <DropdownMenu onCategoryChange={handleCategoryChange} />
                            <View style={styles.guideContainer}>
                                <Text style={styles.guideText}>Guide de fonctionnement</Text>
                            </View>
                        </View>
                        <View style={styles.container1}>
                            <CarouselScreen onCategoryChanged={console.log} />
                        </View>
                        <View style={styles.Prestation}>
                            <Text style={styles.PrestationText1}>Prestation Pro</Text>
                        </View>
                        <View style={{ margin: 5, marginHorizontal: 15, marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'TimesNewRomanBold', fontSize: 20 }}>
                                Nous envoyons des professionnels à votre porte, selon votre delai et votre budget
                            </Text>
                        </View>
                    </LinearGradient>
        
                    <View style={{backgroundColor: '#fff'}}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <FlatList
                                data={modalData}
                                renderItem={renderItems}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        )}
                    </View>
                </ScrollView>
            </SafeAreaProvider>
        </>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
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
        width: 70,
        height: 70,
        borderRadius: 35,
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
        // flexDirection: 'row',
        //backgroundColor: Colors.bgColorsgreen,
        borderRadius: 50,
        paddingHorizontal: 10,

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
        fontFamily: 'TimesNewRomanBold',
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
        fontWeight: 'bold',
        fontFamily: 'TimesNewRomanBold',
        color: Colors.bgColorsprice,
        fontSize: 14,
        marginVertical: 5,
    },
})