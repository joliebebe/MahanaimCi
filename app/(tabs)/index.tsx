import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CategoryButtons from '../../components/CategoryButtons';
import CarouselScreen from '@/components/carousel';
import { modalType } from '@/types/modalType';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContext } from '@/context/UserContext';
import { ImageContext } from '@/context/ImageContext';
import axios from 'axios';

const Page = () => {
    const headerHeight = useHeaderHeight();
    const { user } = useContext(UserContext);
    const { selectedImage } = useContext(ImageContext);
    const [modalData, setModalData] = useState<modalType[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <Text style={styles.itemPrice}>{item.prix} FCFA</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
    const [showDropdown, setShowDropdown] = useState(false);

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
                            <View style={{ margin: 5, marginHorizontal: 15, paddingTop: 25 }}>
                                <Text style={styles.titre}>
                                    Akwaba, {user && user.nom ? <Text style={styles.titre}>{user.nom}</Text> : "Utilisateur"}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: 15, alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.titre}>Bienvenue {'\n'}sur le marché{'\n'}MAHANAIIM.CI</Text>
                                </View>
                                <View style={styles.iconContainer}>
                                    {selectedImage ? (
                                        <Image source={{ uri: selectedImage }} style={styles.icon} />
                                    ) : (
                                        <Image source={require('../../assets/images/mon-icone.png')} style={styles.icon} />
                                    )}
                                </View>
                            </View>
                            <View style={styles.searchSectionWrapper}>
                                <View style={styles.searchBar}>
                                    <TextInput placeholder="Recherche ici" placeholderTextColor="#fff" style={{ flex: 1, color: Colors.white }} />
                                    <Ionicons name='search' size={24} style={{ marginLeft: 10, color: Colors.white }} />
                                </View>
                            </View>
                            <CategoryButtons onCategoryChange={handleCategoryChange} setShowDropdown={setShowDropdown} />

                            <View style={styles.guideContainer}>
                                <Text style={styles.guideText}>Guide de fonctionnement</Text>
                            </View>
                        </View>
                        <View style={styles.container1}>
                            <CarouselScreen onCategoryChanged={console.log} />
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