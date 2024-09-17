import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItemType } from '@/types/cardItemType'; // Ensure this type is defined correctly
import * as SecureStore from 'expo-secure-store';

type OrderType = {
  id: string;
  items: CartItemType[];
  total: number;
  deliveryFee: number;
  paymentMethod: string;
};

type CartContextType = {
  cart: CartItemType[];
  addItemToCart: (item: CartItemType, quantity: number) => void;
  removeItemFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartEmpty: boolean;
  orderHistory: OrderType[];
  addOrderToHistory: (order: OrderType) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);
  const [orderHistory, setOrderHistory] = useState<OrderType[]>([]);

  useEffect(() => {
    const loadOrderHistory = async () => {
      try {
        const storedHistory = await SecureStore.getItemAsync('orderHistory');
        if (storedHistory) {
          setOrderHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error loading order history from SecureStore:', error);
      }
    };

    const loadCart = async () => {
      try {
        const storedCart = await SecureStore.getItemAsync('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error('Error loading cart from SecureStore:', error);
      }
    };

    loadOrderHistory();
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await SecureStore.setItemAsync('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to SecureStore:', error);
      }
    };

    saveCart();
  }, [cart]);

  useEffect(() => {
    const saveOrderHistory = async () => {
      try {
        await SecureStore.setItemAsync('orderHistory', JSON.stringify(orderHistory));
      } catch (error) {
        console.error('Error saving order history to SecureStore:', error);
      }
    };

    saveOrderHistory();
  }, [orderHistory]);

  const addItemToCart = (item: CartItemType, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
    setIsCartEmpty(false);
  };

  const removeItemFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      setIsCartEmpty(updatedCart.length === 0);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setIsCartEmpty(true);
  };

  const addOrderToHistory = (order: OrderType) => {
    setOrderHistory((prevOrderHistory) => [...prevOrderHistory, order]);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart, isCartEmpty, orderHistory, addOrderToHistory }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
