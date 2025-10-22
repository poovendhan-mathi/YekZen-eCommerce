import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../firebase/productsService";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  limit,
} from "firebase/firestore";

// Mock Firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

jest.mock("../firebase/config", () => ({
  db: {},
}));

describe("Products Service", () => {
  const mockProducts = [
    {
      id: "1",
      name: "Product 1",
      category: "audio",
      price: 99.99,
      featured: true,
      description: "Test product 1",
      brand: "Test Brand",
    },
    {
      id: "2",
      name: "Product 2",
      category: "gaming",
      price: 149.99,
      featured: false,
      description: "Test product 2",
      brand: "Test Brand",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe("getAllProducts", () => {
    it("should fetch all products successfully", async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => ({ ...product }),
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getAllProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[0].name).toBe("Product 1");
    });

    it("should return empty array on error", async () => {
      getDocs.mockRejectedValue(new Error("Firestore error"));

      const result = await getAllProducts();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("should fetch product by ID successfully", async () => {
      const mockProduct = mockProducts[0];
      const mockDoc = {
        exists: () => true,
        id: mockProduct.id,
        data: () => mockProduct,
      };

      getDoc.mockResolvedValue(mockDoc);

      const result = await getProductById("1");

      expect(result.success).toBe(true);
      expect(result.product.id).toBe("1");
      expect(result.product.name).toBe("Product 1");
    });

    it("should return error when product not found", async () => {
      const mockDoc = {
        exists: () => false,
      };

      getDoc.mockResolvedValue(mockDoc);

      const result = await getProductById("999");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Product not found");
    });
  });

  describe("getProductsByCategory", () => {
    it("should fetch products by category", async () => {
      const audioProducts = [mockProducts[0]];
      const mockQuerySnapshot = {
        forEach: (callback) => {
          audioProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => product,
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getProductsByCategory("audio");

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("audio");
    });
  });

  describe("getFeaturedProducts", () => {
    it("should fetch featured products", async () => {
      const featuredProducts = [mockProducts[0]];
      const mockQuerySnapshot = {
        forEach: (callback) => {
          featuredProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => product,
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await getFeaturedProducts(8);

      expect(result).toHaveLength(1);
      expect(result[0].featured).toBe(true);
    });
  });

  describe("searchProducts", () => {
    it("should search products by name", async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => product,
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await searchProducts("Product 1");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Product 1");
    });

    it("should search products by brand", async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => product,
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await searchProducts("Test Brand");

      expect(result).toHaveLength(2);
    });

    it("should return empty array when no matches", async () => {
      const mockQuerySnapshot = {
        forEach: (callback) => {
          mockProducts.forEach((product) => {
            callback({
              id: product.id,
              data: () => product,
            });
          });
        },
      };

      getDocs.mockResolvedValue(mockQuerySnapshot);

      const result = await searchProducts("NonexistentProduct");

      expect(result).toHaveLength(0);
    });
  });

  describe("addProduct", () => {
    it("should add product successfully", async () => {
      const newProduct = {
        name: "New Product",
        price: 199.99,
        category: "computers",
      };

      addDoc.mockResolvedValue({ id: "new-id" });

      const result = await addProduct(newProduct);

      expect(result.success).toBe(true);
      expect(result.id).toBe("new-id");
    });

    it("should handle add product error", async () => {
      addDoc.mockRejectedValue(new Error("Add failed"));

      const result = await addProduct({});

      expect(result.success).toBe(false);
      expect(result.error).toBe("Add failed");
    });
  });

  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      updateDoc.mockResolvedValue();

      const result = await updateProduct("1", { price: 89.99 });

      expect(result.success).toBe(true);
    });

    it("should handle update product error", async () => {
      updateDoc.mockRejectedValue(new Error("Update failed"));

      const result = await updateProduct("1", {});

      expect(result.success).toBe(false);
      expect(result.error).toBe("Update failed");
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      deleteDoc.mockResolvedValue();

      const result = await deleteProduct("1");

      expect(result.success).toBe(true);
    });

    it("should handle delete product error", async () => {
      deleteDoc.mockRejectedValue(new Error("Delete failed"));

      const result = await deleteProduct("1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Delete failed");
    });
  });
});
