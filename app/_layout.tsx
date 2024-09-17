import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { ImageProvider } from '@/context/ImageContext';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import initializeAppData from '@/api/initializeAppData'; // Importez la fonction d'initialisation
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  ErrorBoundary, // Catch any errors thrown by the Layout component.
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'login', // Ensure that reloading on `/modal` keeps a back button present.
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    TimesNewRoman: require('../assets/fonts/timesNewRoman.ttf'),
    TimesNewRomanBold: require('../assets/fonts/timesnewromanbold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Vérifie si les données ont déjà été chargées
        const dataAlreadyLoaded = await AsyncStorage.getItem('dataLoaded');
        if (!dataAlreadyLoaded) {
          await initializeAppData();
          await AsyncStorage.setItem('dataLoaded', 'true');
          SplashScreen.hideAsync();
        } else {
          SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Failed to initialize app data:', error);
        // Gérer les erreurs d'initialisation ici
      }
    };

    if (loaded && !error) {
      initializeData();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null; // Return null while fonts are loading
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <UserProvider>
      <CartProvider>
        <ImageProvider>
          <Stack>
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='register' options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </ImageProvider>
      </CartProvider>
    </UserProvider>
  );
}
