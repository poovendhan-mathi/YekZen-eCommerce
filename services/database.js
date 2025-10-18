// Database service for YekZen eCommerce
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// Mock data fallback
import mockProducts from "../mock/products.json";

class DatabaseService {
  constructor() {
    this.useFirebase = this.checkFirebaseConfig();
  }

  checkFirebaseConfig() {
    // Check if Firebase is properly configured
    try {
      const hasConfig =
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "your_project_id_here";
      return hasConfig && typeof window !== "undefined";
    } catch (error) {
      console.log("Firebase not configured, using mock data");
      return false;
    }
  }

  // Products
  async getProducts(filters = {}) {
    if (!this.useFirebase) {
      return this.getMockProducts(filters);
    }

    try {
      let q = collection(db, "products");

      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.order || "asc"));
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      return products;
    } catch (error) {
      console.error("Error fetching products from Firebase:", error);
      return this.getMockProducts(filters);
    }
  }

  async getProduct(id) {
    if (!this.useFirebase) {
      return this.getMockProduct(id);
    }

    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching product from Firebase:", error);
      return this.getMockProduct(id);
    }
  }

  async addProduct(productData) {
    if (!this.useFirebase) {
      console.log("Mock: Would add product:", productData);
      return { id: "mock_" + Date.now(), ...productData };
    }

    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error("Error adding product to Firebase:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    if (!this.useFirebase) {
      console.log("Mock: Would update product:", id, productData);
      return { id, ...productData };
    }

    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date(),
      });
      return { id, ...productData };
    } catch (error) {
      console.error("Error updating product in Firebase:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    if (!this.useFirebase) {
      console.log("Mock: Would delete product:", id);
      return true;
    }

    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (error) {
      console.error("Error deleting product from Firebase:", error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    if (!this.useFirebase) {
      return this.getMockCategories();
    }

    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories from Firebase:", error);
      return this.getMockCategories();
    }
  }

  // Orders
  async getUserOrders(userId) {
    if (!this.useFirebase) {
      return this.getMockOrders(userId);
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders;
    } catch (error) {
      console.error("Error fetching orders from Firebase:", error);
      return this.getMockOrders(userId);
    }
  }

  async createOrder(orderData) {
    if (!this.useFirebase) {
      console.log("Mock: Would create order:", orderData);
      return { id: "order_" + Date.now(), ...orderData, status: "pending" };
    }

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error("Error creating order in Firebase:", error);
      throw error;
    }
  }

  // Mock data methods
  getMockProducts(filters = {}) {
    let products = [...mockProducts];

    if (filters.category) {
      products = products.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.orderBy === "price") {
      products.sort((a, b) =>
        filters.order === "desc" ? b.price - a.price : a.price - b.price
      );
    } else if (filters.orderBy === "name") {
      products.sort((a, b) =>
        filters.order === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
    }

    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }

    return Promise.resolve(products);
  }

  getMockProduct(id) {
    const product = mockProducts.find((p) => p.id == id);
    return Promise.resolve(product || null);
  }

  getMockCategories() {
    const categories = [
      {
        id: 1,
        name: "Electronics",
        description: "Latest gadgets and devices",
        count: 156,
      },
      {
        id: 2,
        name: "Fashion",
        description: "Trendy clothing and accessories",
        count: 234,
      },
      {
        id: 3,
        name: "Home & Garden",
        description: "Everything for your home",
        count: 89,
      },
      {
        id: 4,
        name: "Sports",
        description: "Sports equipment and fitness gear",
        count: 67,
      },
      {
        id: 5,
        name: "Books",
        description: "Wide selection of books",
        count: 345,
      },
      {
        id: 6,
        name: "Beauty",
        description: "Cosmetics and personal care",
        count: 123,
      },
    ];
    return Promise.resolve(categories);
  }

  getMockOrders(userId) {
    const orders = [
      {
        id: "order_1",
        userId,
        items: [
          {
            id: 1,
            name: "Premium Wireless Headphones",
            quantity: 1,
            price: 299.99,
          },
        ],
        total: 299.99,
        status: "delivered",
        createdAt: new Date("2024-10-15"),
        shippingAddress: {
          name: "John Doe",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
        },
      },
      {
        id: "order_2",
        userId,
        items: [
          { id: 2, name: "Smart Fitness Watch", quantity: 1, price: 199.99 },
          { id: 3, name: "Bluetooth Speaker", quantity: 2, price: 79.99 },
        ],
        total: 359.97,
        status: "shipped",
        createdAt: new Date("2024-10-12"),
        shippingAddress: {
          name: "John Doe",
          street: "123 Main St",
          city: "Anytown",
          state: "CA",
          zip: "12345",
        },
      },
    ];
    return Promise.resolve(orders);
  }

  // Initialize Firebase collections with sample data
  async initializeSampleData() {
    if (!this.useFirebase) {
      console.log(
        "Firebase not configured, skipping sample data initialization"
      );
      return;
    }

    try {
      // Check if products already exist
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (!productsSnapshot.empty) {
        console.log("Sample data already exists");
        return;
      }

      // Add sample products
      console.log("Initializing sample data...");
      for (const product of mockProducts) {
        await addDoc(collection(db, "products"), {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Add sample categories
      const categories = this.getMockCategories();
      const categoriesData = await categories;
      for (const category of categoriesData) {
        await addDoc(collection(db, "categories"), {
          ...category,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log("Sample data initialized successfully");
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
}

// Export singleton instance
const dbService = new DatabaseService();
export default dbService;
