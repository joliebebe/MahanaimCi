import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Page = () => {
  return (
    <View style={styles.container}>
      <Text>Votre commande a été validée avec succès!</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
