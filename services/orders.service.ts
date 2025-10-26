// Order service for creating orders and updating stock
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreateOrderData {
  items: OrderItem[];
  customerInfo: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  paymentId?: string;
}

export const ordersService = {
  /**
   * Create a new order and update product stock
   */
  async createOrder(orderData: CreateOrderData): Promise<{
    success: boolean;
    orderId?: string;
    error?: string;
  }> {
    try {
      // Start creating the order
      const order = {
        items: orderData.items,
        customerInfo: orderData.customerInfo,
        paymentMethod: orderData.paymentMethod,
        totalAmount: orderData.totalAmount,
        paymentId: orderData.paymentId || null,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const orderRef = await addDoc(collection(db, "orders"), order);

      // Update stock for each product
      const stockUpdatePromises = orderData.items.map(async (item) => {
        const productRef = doc(db, "products", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock || 0;

          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}`);
          }

          // Decrease stock
          await updateDoc(productRef, {
            stock: increment(-item.quantity),
            updatedAt: serverTimestamp(),
          });
        } else {
          throw new Error(`Product ${item.name} not found`);
        }
      });

      await Promise.all(stockUpdatePromises);

      return {
        success: true,
        orderId: orderRef.id,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create order",
      };
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<{
    success: boolean;
    order?: any;
    error?: string;
  }> {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      return {
        success: true,
        order: {
          id: orderSnap.id,
          ...orderSnap.data(),
        },
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order",
      };
    }
  },

  /**
   * Get all orders (for admin)
   */
  async getAllOrders(): Promise<{
    success: boolean;
    orders?: any[];
    error?: string;
  }> {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
        });
      });

      return {
        success: true,
        orders,
      };
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch orders",
        orders: [],
      };
    }
  },

  /**
   * Get orders for a specific user
   */
  async getUserOrders(userEmail: string): Promise<{
    success: boolean;
    orders?: any[];
    error?: string;
  }> {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("customerInfo.email", "==", userEmail),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
        });
      });

      return {
        success: true,
        orders,
      };
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user orders",
        orders: [],
      };
    }
  },

  /**
   * Calculate order statistics (for admin dashboard)
   */
  async getOrderStats(): Promise<{
    success: boolean;
    stats?: {
      totalOrders: number;
      totalRevenue: number;
      pendingOrders: number;
      deliveredOrders: number;
    };
    error?: string;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));

      let totalOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;
      let deliveredOrders = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalOrders++;
        totalRevenue += data.totalAmount || 0;

        if (data.status === "pending" || data.status === "processing") {
          pendingOrders++;
        }
        if (data.status === "delivered") {
          deliveredOrders++;
        }
      });

      return {
        success: true,
        stats: {
          totalOrders,
          totalRevenue,
          pendingOrders,
          deliveredOrders,
        },
      };
    } catch (error) {
      console.error("Error calculating order stats:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to calculate stats",
      };
    }
  },
};
