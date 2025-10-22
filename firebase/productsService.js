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

/**
 * Add a new product to Firestore
 */
export const addProduct = async (productData) => {
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
    return { success: false, error: error.message };
  }
};

/**
 * Get all products
 */
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified - no orderBy to avoid index requirements in emulator
    const querySnapshot = await getDocs(productsRef);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
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
export const getProductById = async (productId) => {
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
    return { success: false, error: error.message };
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified query - just filter by category
    const q = query(productsRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
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
export const getFeaturedProducts = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Simplified query - remove orderBy to avoid composite index requirement
    const q = query(
      productsRef,
      where("featured", "==", true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(
      `📦 Fetched ${products.length} featured products from Firestore`
    );
    return products; // Return array directly
  } catch (error) {
    console.error("❌ Error getting featured products:", error);
    console.error("Error details:", error.code, error.message);
    return []; // Return empty array on error
  }
};

/**
 * Search products by name or description
 */
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsRef);

    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchLower = searchTerm.toLowerCase();

      if (
        data.name.toLowerCase().includes(searchLower) ||
        data.description.toLowerCase().includes(searchLower) ||
        data.brand.toLowerCase().includes(searchLower)
      ) {
        products.push({
          id: doc.id,
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
export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get products with filters
 */
export const getFilteredProducts = async (filters = {}) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q = query(productsRef);

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

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { success: true, products };
  } catch (error) {
    console.error("Error getting filtered products:", error);
    return { success: false, products: [], error: error.message };
  }
};
