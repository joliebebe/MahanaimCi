import { CartItemType } from "./cardItemType";

export interface CartContextType {
   cart: CartItemType[];
    updateItemQuantity: (itemId: string, newQuantity: number) => void;
    getTotalPrice: () => number;
    clearCart: () => void;
    addItemToCart: (itemId: string, newQuantity: number) => void;
  };