import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItemType } from '@/types/cardItemType'; // Assurez-vous que le type est défini

type CartContextType = {
  cart: CartItemType[];
  addItemToCart: (item: CartItemType, quantity: number) => void;
  removeItemFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartEmpty: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);

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

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart, isCartEmpty }}>
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
