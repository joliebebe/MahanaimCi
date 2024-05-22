import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Page = () => {
  return (
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "notif",
        }}
      />
      

  );
};

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
