import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { CartProvider } from '@/context/CartContext';
import Colors from '@/constants/Colors'

export default function layout() {
  return (
    <CartProvider>
<Tabs screenOptions={
        {
            tabBarStyle:{
                backgroundColor: Colors.bgColorsmenu,
                borderTopWidth: 0,
                padding: 0,
            },
            tabBarShowLabel: false,
            tabBarActiveTintColor: Colors.black,
            tabBarInactiveTintColor:'#999',
            headerShown: false ,
        }
    }>
        <Tabs.Screen name='index' options={{
            tabBarIcon: ({color}) =>(
                <Ionicons name='home' size={26} color={color}/>
            ),
        }}/>
        <Tabs.Screen name='shopping' options={{
            tabBarIcon: ({color}) =>(
                <FontAwesome name="shopping-basket" size={24} color={color}/>
            ),
        }}/>
        <Tabs.Screen name='profile' options={{
            tabBarIcon: ({color}) =>(
                <Ionicons name='person' size={26} color={color}/>
            ),
        }}/>
        <Tabs.Screen name='notification' options={{
            tabBarIcon: ({color}) =>(
                <Ionicons name='notifications' size={26} color={color}/>
            ),
        }}/>
    </Tabs>
    </CartProvider>
    
  )
}