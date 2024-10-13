import React, { useEffect } from 'react';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { ImageProvider } from '@/context/ImageContext';
import Toast from 'react-native-toast-message';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import initializeAppData from '@/api/initializeAppData'; // Importez la fonction d'initialisation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { color } from '@rneui/base';

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
    Mono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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

const navigation = useNavigation();

  return (
    <UserProvider>
      <CartProvider>
        <ImageProvider>
          <Stack>
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='PasswordRemove' options={{ headerTitle: 'Mot de passe oublié', headerTitleStyle:{fontFamily:'TimesNewRomanBold', fontSize:18, color:'#8b8745'}, headerLeft: () => (<TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: 10, padding: 4, margin:10 }}><FontAwesome5 name="arrow-left" size={20} color="#8b8745" /></TouchableOpacity>), }} />
            <Stack.Screen name='whatappForm' options={{ headerTitle: 'Solliciter sur whatsapp',headerTitleStyle:{fontFamily:'TimesNewRomanBold', fontSize:18, color:'#8b8745'}, headerLeft: () => (<TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: "rgba(255, 255, 255, 1)", borderRadius: 10, padding: 4, margin:10 }}><FontAwesome5 name="arrow-left" size={20} color="#8b8745" /></TouchableOpacity>), }} />
            <Stack.Screen name='register' options={{ headerShown: false }} />
            <Stack.Screen name='modal/[id]' options={{ headerTitle: '',}} />
            <Stack.Screen name='listing/[id]' options={{ headerTitle: '',}} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </ImageProvider>
      </CartProvider>
    </UserProvider>
  );
}
