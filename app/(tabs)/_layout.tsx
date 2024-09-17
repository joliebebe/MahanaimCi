import React from 'react';
import { Tabs, router, useNavigation } from 'expo-router';
import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';
import Colors from '@/constants/Colors';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const Layout = () => {
  const { cart } = useCart(); // Utilisez le hook useCart pour accéder au panier

  // Vérifiez si le panier contient des articles pour décider d'afficher l'indicateur
  const isCartEmpty = cart.length === 0;

  if (!isCartEmpty) {
    console.log(`Le panier n'est pas vide`);
  }
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.bgColorsmenu,
            borderTopWidth: 0,
            padding: 0,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.black,
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="shopping"
          options={{
            tabBarIcon: ({ color }) => (
              <View>
                <FontAwesome name="shopping-basket" size={24} color={color} />
                {/* Affichez l'indicateur seulement si le panier n'est pas vide */}
                {!isCartEmpty && <View style={styles.indicator}></View>}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            tabBarIcon: ({ color }) => <Entypo name="back-in-time" size={26} color={color} />,
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.bgColorsgreen,
  },
});

export default Layout;
