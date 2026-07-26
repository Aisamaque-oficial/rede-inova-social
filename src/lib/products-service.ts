import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  citySlug: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string; // Used for WhatsApp redirect
  createdAt?: any;
}

export const productsService = {
  // Get products for a specific city
  async getProductsByCity(citySlug: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, "products"),
        where("citySlug", "==", citySlug),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Get products by farmer (for internal panel)
  async getProductsByFarmer(farmerId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, "products"),
        where("farmerId", "==", farmerId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error("Error fetching farmer products:", error);
      return [];
    }
  },

  // Add a new product
  async addProduct(product: Omit<Product, "id" | "createdAt">): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  },

  // Update product
  async updateProduct(productId: string, data: Partial<Product>): Promise<boolean> {
    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  },

  // Delete product
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "products", productId));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }
};
