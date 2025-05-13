import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  image: string;
  amount: number;
  variant: ProductVariant;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
  isShowCartDrawer: boolean;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
  setShowCartDrawer: (value: boolean) => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      isShowCartDrawer: false,
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) =>
              item.id === newProduct.id &&
              item.variant.id === newProduct.variant.id
          );
          if (!cartItem) {
            return { products: [...state.products, newProduct] };
          }
          return {
            products: state.products.map((product) =>
              product.id === newProduct.id &&
              product.variant.id === newProduct.variant.id
                ? { ...product, amount: product.amount + newProduct.amount }
                : product
            ),
          };
        });
      },
      clearCart: () => {
        set((state: any) => {
          return {
            products: [],
            allQuantity: 0,
            total: 0,
          };
        });
      },
      removeFromCart: (id) => {
        set((state) => {
          state.products = state.products.filter(
            (product: ProductInCart) => product.variant.id !== id
          );
          return { products: state.products };
        });
      },

      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.variant.price;
          });

          return {
            products: state.products,
            allQuantity: amount,
            total: total,
          };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === id);

          if (!cartItem) {
            return { products: [...state.products] };
          } else {
            state.products.map((product) => {
              if (product.id === cartItem.id) {
                product.amount = amount;
              }
            });
          }

          return { products: [...state.products] };
        });
      },
      setShowCartDrawer: (value) => {
        set((state) => {
          return {
            isShowCartDrawer: value,
          };
        });
      },
    }),
    {
      name: "products-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
