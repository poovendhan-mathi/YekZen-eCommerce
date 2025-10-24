// Firebase Firestore Product Service
import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const PRODUCTS_COLLECTION = "products";

interface ProductData {
  [key: string]: any;
}

interface ProductResponse {
  success: boolean;
  id?: string;
  product?: any;
  error?: string;
}

/**
 * Add a new product to Firestore
 */
export const addProduct = async (
  productData: ProductData
): Promise<ProductResponse> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<any[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified - no orderBy to avoid index requirements in emulator
    const querySnapshot = await getDocs(productsRef);

    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    console.log(`📦 Fetched ${products.length} products from Firestore`);
    return products; // Return array directly
  } catch (error) {
    console.error("❌ Error getting products:", error);
    return []; // Return empty array on error
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (
  productId: string
): Promise<ProductResponse> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return {
        success: true,
        product: {
          id: productSnap.id,
          ...productSnap.data(),
        },
      };
    } else {
      return { success: false, error: "Product not found" };
    }
  } catch (error) {
    console.error("Error getting product:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (
  category: string
): Promise<any[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified query - just filter by category
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    console.log(
      `📦 Fetched ${products.length} products for category: ${category}`
    );
    return products; // Return array directly
  } catch (error) {
    console.error("❌ Error getting products by category:", error);
    return []; // Return empty array on error
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (
  limitCount: number = 8
): Promise<any[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified query - remove orderBy to avoid composite index requirement
    const q = query(
      productsRef,
      where("featured", "==", true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    console.log(
      `📦 Fetched ${products.length} featured products from Firestore`
    );
    return products; // Return array directly
  } catch (error) {
    console.error("❌ Error getting featured products:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return []; // Return empty array on error
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (searchTerm: string): Promise<any[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsRef);

    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const searchLower = searchTerm.toLowerCase();

      if (
        data.name?.toLowerCase().includes(searchLower) ||
        data.description?.toLowerCase().includes(searchLower) ||
        data.brand?.toLowerCase().includes(searchLower)
      ) {
        products.push({
          id: docSnap.id,
          ...data,
        });
      }
    });

    console.log(`🔍 Found ${products.length} products matching: ${searchTerm}`);
    return products; // Return array directly
  } catch (error) {
    console.error("Error searching products:", error);
    return []; // Return empty array on error
  }
};

/**
 * Update product
 */
export const updateProduct = async (
  productId: string,
  updateData: ProductData
): Promise<ProductResponse> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (
  productId: string
): Promise<ProductResponse> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
};

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
}

/**
 * Get products with filters
 */
export const getFilteredProducts = async (
  filters: ProductFilters = {}
): Promise<any> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q: any = query(productsRef);

    // Apply category filter
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      q = query(q, where("price", ">=", filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      q = query(q, where("price", "<=", filters.maxPrice));
    }

    // Apply in stock filter
    if (filters.inStock !== undefined) {
      q = query(q, where("inStock", "==", filters.inStock));
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortField = filters.sortBy === "price" ? "price" : "createdAt";
      const sortDirection = filters.sortOrder === "asc" ? "asc" : "desc";
      q = query(q, orderBy(sortField, sortDirection));
    } else {
      q = query(q, orderBy("createdAt", "desc"));
    }

    // Apply limit
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);

    const products: any[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push({
        id: docSnap.id,
        ...(docSnap.data() as object),
      });
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error getting filtered products:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, products: [], error: message };
  }
};
