import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, Animated, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const CarouselScreen = () => {

  const data = [
    '1- Dérouler le menu ',
    "2- Cliqué sur l'objet de la recherche",
    '3- Choissisez parmis les villes ou le produit est disponible de préférence la plus proche',
    '4- Remplissez votre panier puis validé',

    // Ajoutez autant de textes que nécessaire
  ];
  const scrollViewRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Animation pour déplacer le texte
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current.scrollTo({ x: nextIndex * windowWidth, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handlePaginationPress = (index) => {
    setActiveIndex(index);
    scrollViewRef.current.scrollTo({ x: index * windowWidth, animated: true });
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/dashbord1.png')} style={styles.backgroundImage}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) => {
            const currentIndex = Math.floor(event.nativeEvent.contentOffset.x / windowWidth);
            setActiveIndex(currentIndex);
          }}
        >
          {data.map((item, index) => (
            <View key={index} style={styles.textContainer}>
              <View style={styles.background}>
                <Text style={styles.text}>{item}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationButton,
                index === activeIndex ? styles.activeButton : styles.inactiveButton,
              ]}
              onPress={() => handlePaginationPress(index)}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   marginBottom: 15,
  },
  backgroundImage: {
    resizeMode: 'cover',
    justifyContent: 'center',
  
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    width: windowWidth - 40, // La largeur de l'écran moins la marge désirée (20 de chaque côté)
    marginHorizontal: 15,
    margin:5,
    paddingHorizontal:15,

  },
  background: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius: 15,
    marginVertical:15,
    paddingHorizontal:15,
    marginHorizontal:15,
  },
  text: {
    fontSize: 19,
    color: '#000',
    textAlign: 'justify',
    fontFamily: 'TimesNewRomanBold',
    marginVertical: 20,
    marginHorizontal: 20, 
    lineHeight: 24,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#63f345',
  },
  inactiveButton: {
    backgroundColor: 'lightgrey',
  },
});

export default CarouselScreen;
