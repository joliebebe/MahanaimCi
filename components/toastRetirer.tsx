import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const toastRetirer = () => {
  return (
    <Animated.View 
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={styles.toastContainer}
    >
      <MaterialIcons name='info' size={30} color={'#F6F4F4'} />
      <View>
      <Text style={styles.toastTitle}>Info</Text>
      <Text style={styles.toastMessage}>Produit retiré {'\n'}du panier avec succès</Text>

      </View>
    </Animated.View>
  );
};

export default toastRetirer;

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    top: 70,
    backgroundColor: '#8b8745',
    width: '80%',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#900C3F',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 2,
    //borderRadius:30,
  },
  toastTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#F6F4F4',
    fontSize: 16,
  },
  toastMessage: {
    marginLeft: 10,
    fontWeight: '500',
    color: '#F6F4F4',
    fontSize: 14,
  },
});
