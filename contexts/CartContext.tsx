// Goal: Shopping cart context with add/remove/update functionality
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
}

interface CartAction {
  type: string;
  payload?: any;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  isInCart: (productId: number | string) => boolean;
  getItemQuantity: (productId: number | string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      const quantityToAdd = action.payload.quantity || 1;

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: quantityToAdd }],
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("yekzen-cart");
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("yekzen-cart", JSON.stringify(state.items));
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [state.items]);

  // Cart actions with useCallback for performance
  const addToCart = useCallback((product: CartItem): void => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
    // Don't show toast here - let the calling component handle it
  }, []);

  const removeFromCart = useCallback(
    (productId: number | string): void => {
      const item = state.items.find((item: CartItem) => item.id === productId);
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
    },
    [state.items]
  );

  const updateQuantity = useCallback(
    (productId: number | string, quantity: number): void => {
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { id: productId, quantity },
      });
    },
    []
  );

  const clearCart = useCallback((): void => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success("Cart cleared");
  }, []);

  // Cart calculations with useMemo for performance
  const getItemCount = useCallback((): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getSubtotal = useCallback((): number => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [state.items]);

  const getTax = useCallback((): number => {
    return getSubtotal() * 0.08; // 8% tax
  }, [getSubtotal]);

  const getShipping = useCallback((): number => {
    return getSubtotal() > 50 ? 0 : 9.99; // Free shipping over $50
  }, [getSubtotal]);

  const getTotal = useCallback((): number => {
    return getSubtotal() + getTax() + getShipping();
  }, [getSubtotal, getTax, getShipping]);

  const isInCart = useCallback(
    (productId: number | string): boolean => {
      return state.items.some((item: CartItem) => item.id === productId);
    },
    [state.items]
  );

  const getItemQuantity = useCallback(
    (productId: number | string): number => {
      const item = state.items.find((item: CartItem) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      // State
      items: state.items,

      // Actions
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,

      // Calculations
      getItemCount,
      getSubtotal,
      getTax,
      getShipping,
      getTotal,
      isInCart,
      getItemQuantity,
    }),
    [
      state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal,
      getTax,
      getShipping,
      getTotal,
      isInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
