import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItemType } from '@/types/cardItemType'; // Assurez-vous que le chemin d'importation est correct

export type CartContextType = {
  cart: CartItemType[];
  addItemToCart: (item: CartItemType, quantity: number) => void; // Ajoutez addItemToCart
  updateItemQuantity: (itemId: string, newQuantity: number) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
};


const CartContext = createContext<CartContextType>({
  cart: [],
  updateItemQuantity: () => {},
  getTotalPrice: () => 0,
  clearCart: () => {},
  addItemToCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]); // Renommez cartItems en cart

  const addItemToCart = (item: CartItemType, quantity: number) => {
    // Vérifiez si l'article est déjà dans le panier
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // Si l'article existe, mettez à jour sa quantité
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Sinon, ajoutez un nouvel article
      setCart((prevCart) => [...prevCart, { ...item, quantity }]);
    }
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, updateItemQuantity, getTotalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
